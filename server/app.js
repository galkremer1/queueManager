var kue = require('kue')
  , jobs = kue.createQueue()
  ;
let express = require('express');
let app = express();
const MAXQUEUE = 10;
const JOBTIME = 10;


function newJob (name, priority){
  name = name || 'Default_Name';
  priority = priority || 'normal';
  var job = jobs.create('new job', {
    name: name
  }).removeOnComplete( true );
  job
    .on('complete', function (){
      console.log('Job', job.id, 'with name', job.data.name, 'is done');
      setTimeout(()=>{
        newJob('Automatic Job');
      }, 10000)
    })
    .on('failed', function (){
      console.log('Job', job.id, 'with name', job.data.name, 'has failed');
    })

  job.priority(priority).save();
}

jobs.process('new job', MAXQUEUE ,function (job, done){
  /* carry out all the job function here */
  setTimeout(()=>{done && done();}, JOBTIME, this)
});


jobs.activeCount( function( err, total ) { // others are activeCount, completeCount, failedCount, delayedCount
    console.log('total is ', total);
    if( total == 0 ) {
        console.log('No active jobs, starting an automated task');
        newJob('Automatic Job');
    }
  });

app.get('/task', function (req, res) {
  console.log('got a request');
  newJob('Manual Job', 'high');
  res.send('test');
})
app.listen(5000);