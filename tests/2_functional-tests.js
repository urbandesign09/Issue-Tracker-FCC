const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

    suite('Functional Tests', function() {
  
        //create an issue with every field
        test('Create an issue with every field (valid input)', function(done){
          chai
            .request(server)
            .post('/api/issues/apitest')
            .send({
              issue_title: 'Recursion Problem',
              issue_text: 'Problem Set has infinite loop.',
              created_by: 'Will Smith',
              assigned_to: 'Denzel Washington',
              status_text: 'Problem set in Beta-Testing',
            })
            .end(function(err, res){
              assert.equal(res.body.issue_title, 'Recursion Problem');
              assert.equal(res.body.issue_text, 'Problem Set has infinite loop.');
              assert.equal(res.body.created_by, 'Will Smith');
              assert.equal(res.body.assigned_to, 'Denzel Washington');
              assert.equal(res.body.status_text, 'Problem set in Beta-Testing');
              done();
            });
        })
      
        //create an issue with only required fields
        test('Create an issue with only required fields (valid input)', function(done){
          chai
            .request(server)
            .post('/api/issues/apitest')
            .send({
              issue_title: 'Required Problem',
              issue_text: 'This is a test with required fields.',
              created_by: 'Darth Vader',
            })
            .end(function(err, res){
              assert.equal(res.body.issue_title, 'Required Problem');
              assert.equal(res.body.issue_text, 'This is a test with required fields.');
              assert.equal(res.body.created_by, 'Darth Vader');
              assert.equal(res.body.assigned_to, '');
              assert.equal(res.body.status_text, '');
              done();
            });
        })
      
        //create an issue with missing required fields
        test('Create an issue with missing required fields (invalid input)', function(done){
          chai
            .request(server)
            .post('/api/issues/apitest')
            .send({
              issue_title: 'An Invalid Issue',
              created_by: 'Of Mice and Men',
            })
            .end(function(err, res){
              assert.equal(res.body.error, 'required field(s) missing');
              done();
            });
        })
      
        //view issues on a project
        test('View issue on a project (valid input)', function(done){
          chai
            .request(server)
            .get('/api/issues/apitest')
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(typeof(res.body), 'object');
              done();
            });
        })  
      
        //view issues on project with one filter
        test('View issue on a project with one filter (valid input)', function(done){
          chai 
            .request(server)
            .get('/api/issues/apitest')
            .query({open: true})
            .end(function(err,res){
              assert.equal(res.status, 200);
              assert.equal(typeof(res.body), 'object');
              assert.notInclude(res.body, {'open': false}, "issues are all open");
              //the req.body returned does not have {'open': false}
              done();
            });
      
        })
      
        //view issues on project with multiple filters
        test('View issue on a project with multiple filters', function(done){
          chai 
            .request(server)
            .get('/api/issues/apitest')
            .query({open: true, issue_text: 'Heehee'})
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(typeof(res.body), 'object');
              assert.notInclude(res.body, {'open': false}, "issues are all open")
              res.body.forEach(object => 
                assert.propertyVal(object, 'issue_text', 'Heehee')
              )
              done();
            });
        })
      
        //update one field on an issue
        test('Update one field on an issue (valid input)', function(done){
          chai  
            .request(server)
            .put('/api/issues/apitest')
            .send({
              _id:'6025df5b11eb721a08119486',
              issue_title: 'Updated Recursion Problem',
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body._id, '6025df5b11eb721a08119486');
              assert.equal(res.body.result, 'successfully updated');
              done();
            })
        })
      
        //update multiple fields on an issue
        test('Update multiple fields on an issue (valid input)', function(done){
          chai 
            .request(server)
            .put('/api/issues/apitest')
            .send({
              _id:'6025df5b11eb721a08119486',
              issue_title: 'Updated Recursion Problem',
              issue_text: 'This text is updated.'
            })
            .end(function(err,res){
              assert.equal(res.status, 200);
              assert.equal(res.body._id, '6025df5b11eb721a08119486');
              assert.equal(res.body.result, 'successfully updated');
              done();
            })
        })
      
        //update issue with missing _id - every
        test('Update issue with missing_id (invalid input)', function(done){
          chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
              issue_title: 'Missing Id',
              issue_text: 'This should be invalid input'
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'missing _id');
              done();
            })
        })
      
        //update an issue with no fields to update - 'Please fill out this field'
        test('Update an issue with no fields to update (invalid input)', function(done){
          chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
              _id:'6025df5b11eb721a08119486'
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'no update field(s) sent');
              assert.equal(res.body._id, '6025df5b11eb721a08119486');
              done();
            })
        })
      
        //update an issue with invalid id - ERROR (or nothing happens)
        test('Update an issue with an invalid id (invalid input)', function(done){
          chai
            .request(server)
            .put('/api/issues/apitest')
            .send({
              _id:'5fe3fd97bcd0mc003bf2974z',
              issue_text: 'adfahdgadfadf'
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'could not update');
              assert.equal(res.body._id, '5fe3fd97bcd0mc003bf2974z');
              done();
            })
        })
      
        //delete an issue with delete request
        test('Delete an issue with a delete request (valid input)', function(done){
          chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({
              _id:'6025df5b11eb721a08119486'
            })
            .end(function(err,res){
              assert.equal(res.status, 200);
              assert.equal(res.body.result, 'successfully deleted');
              assert.equal(res.body._id, '6025df5b11eb721a08119486');
              done();
            })
        })
      
        //delete an issue with invalid _id
        test('Delete an issue with invalid _id (invalid input)', function(done){
          chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({
              _id:'5fe3fd97bcd0mc003bf2974f'
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'could not delete');
              assert.equal(res.body._id, '5fe3fd97bcd0mc003bf2974f')
              done();
            })
        })
      
        //delete an issue with missing _id - j"Please fill out this field"
        test('Delete an issue with missing _id (invalid input)', function(done){
          chai
            .request(server)
            .delete('/api/issues/apitest')
            .send({
              _id:''
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.equal(res.body.error, 'missing _id');
              done();
            })
        })
      


});
