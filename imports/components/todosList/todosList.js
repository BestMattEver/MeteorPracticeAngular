import angular from 'angular';
import angularMeteor from 'angular-meteor';
import {Tasks} from '../../api/tasks.js';

import template from './todosList.html';

class TodosListCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    this.hideCompleted =false;

    this.helpers({
      tasks(){
        const selector = {};

        //if hidecompleted is checked, filter out the checked tasks.
        if(this.getReactively('hideCompleted'))
        {
          selector.checked = {$ne: true};
        }
        //this line returns the task list in reverse order (most recent on top)
        return Tasks.find(selector, {sort: {createdAt: -1} });
      }//end tasks()
    })//end this.helpers
  }//end constructor

  //this function counts incomplete tasks.
  incompleteCount(){
    return Tasks.find({ checked: {$ne: true} }).count();
  }

//this function inserts a new task into the collection Tasks.
  addTask(newTask){
    Tasks.insert({
      text: newTask,
      createdAt: new Date()
    });

    //clear the form.
    this.newTask='';
  }//end addtask

  setChecked(task) {
    // Set the checked property to the opposite of its current value
    Tasks.update(task._id, {
      $set: {
        checked: !task.checked
      },
    });
  }

  // setChecked(task){
  //     Tasks.update(task._id, {$set:{checked: !task.checked}});
  // }//end setchecked

  removeTask(task){
    Tasks.remove(task._id);
  }

}//end todosctrl

export default angular.module('todosList', [angularMeteor])
  .component('todosList',{
    templateUrl: 'imports/components/todosList/todosList.html',
    controller: ['$scope', TodosListCtrl]
  });
