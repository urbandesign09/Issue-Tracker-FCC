'use strict';

module.exports = function (app) {

  app.route('/api/issues/:project')
  
  .get(async (req, res)=> {
    let project = req.params.project;//this indicates which model to look for
    const IssueTracker = mongoose.model(project, issueSchema);

    //add filters
    const {_id, issue_title, issue_text, created_on, updated_on, created_by, assigned_to, open, status_text} = req.query //learn destructuring

  
    //create a new object that contains all the filtered elements
    let filters = {
      _id: _id,
      issue_title: issue_title,
      issue_text: issue_text,
      created_on: created_on,
      updated_on: updated_on,
      created_by: created_by,
      assigned_to: assigned_to,
      open: open,
      status_text: status_text,
    }

    const newFilter = Object.entries(filters)
                            .filter(entry => entry[1] != undefined)
                            .reduce((accum, [key, value])=> {
                              accum[key] = value;
                              return accum;
                            }, {});
    //find({issue_title: 'Dophino', open: 'false'})


    await IssueTracker.find(newFilter).exec(function(err, data){
      if(err) return (err);
      res.json(data);
    })

  })
  
  .post(async (req, res)=> {
    let project = req.params.project;
    const IssueTracker = mongoose.model(project, issueSchema); //create a separate model for each project

    let issueTitle = req.body.issue_title;
    let issueText = req.body.issue_text;
    let createdBy = req.body.created_by;
    let assignedTo = req.body.assigned_to;
    let statusText = req.body.status_text;
    
    if(typeof(issueTitle)!='string' || typeof(issueText) != 'string' || typeof(createdBy) != 'string'){
      res.send({error: 'required field(s) missing'});
    }
    else {
      const issues = new IssueTracker ({
        issue_title: issueTitle,
        issue_text: issueText,
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        created_by: createdBy,
        assigned_to: assignedTo,
        status_text: statusText
      })
      
      await issues.save((err, data)=> {
        if (err) return (err);
        res.json({
          _id: data._id, 
          issue_title: data.issue_title,
          issue_text: data.issue_text,
          created_on: data.created_on,
          updated_on: data.updated_on,
          created_by: data.created_by,
          assigned_to: data.assigned_to,
          open: data.open,
          status_text: data.status_text,
        })
      })
    }
  })
  
  .put(async (req, res) => {
    let project = req.params.project;
    const IssueTracker = mongoose.model(project, issueSchema);

    //add filters
    const {_id, issue_title, issue_text, created_on, updated_on, created_by, assigned_to, open, status_text} = req.body //learn destructuring


    //create a new object that contains all the filtered elements
    let filters = {
      issue_title: issue_title,
      issue_text: issue_text,
      created_by: created_by,
      assigned_to: assigned_to,
      open: open != undefined ? 'false' : '',
      status_text: status_text,
    }
    
    let newFilter = Object.entries(filters)
                            .filter(entry => entry[1] != '')
                            .filter(entry => entry[1] != undefined)
                            .reduce((accum, [key, value])=> {
                              accum[key] = value;
                              return accum;
                            }, {});
    //find({issue_title: 'Dophino', open: 'false'})

    if(!_id){
      return res.json({error: 'missing _id'});
    }
    else if(Object.keys(newFilter).length === 0){
      return res.json({error: 'no update field(s) sent', '_id': _id});
    } else {
            //add final filter elements
      newFilter.updated_on = new Date().toISOString();
      //check if id is valid
      if (!ObjectID.isValid(_id)){
        return res.json({error: 'could not update', '_id':_id});
        }
      else {
        await IssueTracker.findByIdAndUpdate({_id: _id}, newFilter, {new:true}, (err, data) => {
          if(err) return res.json({error: 'could not update', '_id':_id});
          if (!data){
            return res.send({error: 'could not update', '_id':_id})
          }
          else {
            res.json({result:'successfully updated', '_id':_id})
          }
        })
      }
    }
  })
  
  .delete((req, res)=> {
    let project = req.params.project;
    const IssueTracker = mongoose.model(project, issueSchema);

    const {_id} = req.body;
    if (!_id){
      return res.json({error: 'missing _id'});
    } 
    if (!ObjectID.isValid(_id)){
      return res.json({error: 'could not delete', '_id': _id})
    }
    else{ //await needs to be at the end
      //the function is at the end
      IssueTracker.findByIdAndRemove({_id: _id}, 
        (err, data) => {
          if (err) return ({error: 'could not delete', '_id':_id});
          if (data === null){
            res.json({error: 'could not delete', '_id': _id})
          } else {
            res.json({result: 'successfully deleted', '_id': _id})
          }

    })
    
  }
  
  });
  
    
};
