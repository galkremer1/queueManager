var kue = require('kue')
  , jobs = kue.createQueue()
  ;
let express = require('express');
let app = express();
var cors = require('cors');
const MAXQUEUE = 10;
const JOBTIME = 1000 * 15;
const NETWORKTIME = 1000;
const AUTOJOBTIMEOUT = 10 * 1000;

app.use(cors())
app.options('/task', cors()); // enable pre-flight request for DELETE request


function newJob (name, priority){
  console.log('Creating a new ' + name);
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
      }, AUTOJOBTIMEOUT)
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

async function checkJobStatus(deactivate) {
   await jobs.active( async function( err, ids) {
    return await ids.forEach( async function( id ) {
      await kue.Job.get( id, async function( err, job ) {
        deactivate && job.inactive();
      });
    });
  });
}

app.get('/task', function (req, res) {
  console.log('got a request');
  newJob('Manual Job', 'high');
  jobs.activeCount( function( err, total ) { // others are activeCount, completeCount, failedCount, delayedCount
    if (total <= MAXQUEUE) {
      setTimeout(()=>{
        res.sendStatus(200);
      }, NETWORKTIME)
    } else {
      //Over the maximum allowed queue
      res.sendStatus(400);
    }
  });
})

app.get('/queue', function (req, res) {
  checkJobStatus(false).then((data)=>{
    console.log(data);
    res.send(JSON.stringify({data}));
  })
})
checkJobStatus(true);
app.listen(5000);