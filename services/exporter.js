var async = require('async');
var Web3 = require('web3');

var exporter = function(config, db) {
  var self = this;
  self.config = config;
  self.db = db;
  
  self.web3 = new Web3();
  self.web3.setProvider(config.provider);
  
  self.contract = self.web3.eth.contract(config.erc20ABI).at(config.tokenAddress);
  self.allEvents = self.contract.allEvents({fromBlock: config.exportStartBlock, toBlock: "latest"});
  self.newEvents = self.contract.allEvents();
  
  // Processes new events
  self.newEvents.watch(function(err, log) {
    if (err) {
      console.log("Error receiving new log:", err);
      return;
    }
    console.log("New log received:", log);
    
    self.processLog(log, function(err) {
      console.log("New log processed");
    });
    
    if (log.event === "Transfer") {
      self.exportBalance(log.args._from);
      self.exportBalance(log.args._to);
    }
    if (log.event === "Approval") {
      self.exportBalance(log.args._owner);
      self.exportBalance(log.args._spender);
    }
  });
  
  // Retrieves historical events and processed them
  self.allEvents.get(function(err, logs) {
    console.log("Historical events received");
    if (err) {
      console.log("Error receiving historical events:", err);
      return;
    }
    var accounts = {};
    
    logs.forEach(function(log) {
      if (log.event === "Transfer") {
        accounts[log.args._from] = log.args._from;
        accounts[log.args._to] = log.args._to;
      }
      
      if (log.event === "Approval") {
        accounts[log.args._owner] = log.args._owner;
        accounts[log.args._spender] = log.args._spender;
      }
    });
        
    async.eachSeries(logs, self.processLog, function(err) {
      console.log("All historical logs processed");
      self.exportBatchAccounts(accounts);
    });
  });
  
  self.exportBatchAccounts = function(accounts) {
    async.eachSeries(accounts, function(item, callback) {
      self.exportBalance(item, callback);
    }, function(err) {
      console.log("All historical balances updated");
    });
  }
  
  self.processLog = function(log, callback) {  
    log._id = log.blockNumber + "_" + log.transactionIndex + "_" + log.logIndex;
    
    console.log("Exporting log:", log._id);
    
    self.web3.eth.getBlock(log.blockNumber, false, function(err, block) {
      if (err) {
        console.log("Error retrieving block information for log:", err);
        callback();
        return;
      }
      
      log.timestamp = block.timestamp;
      
      if (log.args && log.args._value) {
        log.args._value = log.args._value.toNumber();
      }
      
      self.db.insert(log, function(err, newLogs) {
        if (err) {
          if (err.message.indexOf("unique") !== -1) {
            console.log(log._id, "already exported!");
          } else {
            console.log("Error inserting log:", err);
          }
        }
        
        callback();
      });
    });    
  }
  
  self.exportBalance = function(address, callback) {
    console.log("Exporting balance of", address);
    self.contract.balanceOf(address, function(err, balance) {
      var doc = { _id: address, balance: balance.toNumber() };
      self.db.update({ _id: doc._id }, doc, { upsert: true }, function(err, numReplaced) {
        if (err) {
          console.log("Error updating balance:", err);
        } else {
          console.log("Balance export completed");
        }
        
        if (callback)
          callback();
      });
    });
  }
  
  console.log("Exporter initialized, waiting for historical events...");
}

module.exports = exporter;