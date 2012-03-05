describe('TodoList.Models.Task', function() {

  it('should be defined', function() {
    expect(TodoList.Models.Task).toBeDefined();
  });

  var task;

  beforeEach(function() {
    task = new TodoList.Models.Task();
  });

  it('should have correct default values', function() {
    expect(task.id).toBeUndefined();
    expect(task.get('name')).toEqual('');
    expect(task.get('complete')).toBeFalsy();
  });

  describe('#getName', function() {
    it('should be defined', function() {
      expect(task.getName).toBeDefined();
    });

    it('should return task id', function() {
      stub = sinon.stub(task, 'get').returns('Task name');

      expect(task.getName()).toEqual('Task name');
      expect(stub.calledWith('name')).toBeTruthy();
    });
  });

  describe('#getComplete', function() {
    it('should be defined', function() {
      expect(task.getComplete).toBeDefined();
    });

    it('should return task id', function() {
      stub = sinon.stub(task, 'get').returns(false);

      expect(task.getComplete()).toEqual(false);
      expect(stub.calledWith('complete')).toBeTruthy();
    });
  });

  describe('validations', function() {
    it('should validate presence of name', function() {
      var invalidNames = [null, ""];
      _.each(invalidNames, function(invalidName) {
          spy = sinon.spy();
          task.set({ name: invalidName }, { error: spy });
          expect(spy.calledWith(task, "Task name can't be blank")).toBeTruthy();
      });

      spy = sinon.spy();
      task.set({ name: 'Valid name' }, { error: spy });
      expect(spy.called).toBeFalsy();
    });
  });

  describe('#save', function() {
    var server = null;

    beforeEach(function() {
      server = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
    });

    describe('request', function() {
      var request = null;

      beforeEach(function() {
        task.set({ name: 'New task to do' });
      });

      describe('on create', function() {
        beforeEach(function() {
          task.set({ id: null });
          task.save();
          request = server.requests[0];
        });

        it('should be POST', function() {
          expect(request.method).toEqual('POST');
        });

        it('should be sync', function() {
          expect(request.async).toBeTruthy();
        });

        it('should have valid url', function() {
          expect(request.url).toEqual('/tasks.json')
        });

        it('should send valid data', function() {
          var params = JSON.parse(request.requestBody);
          expect(params.task).toBeDefined();
          expect(params.task.name).toEqual('New task to do');
          expect(params.task.complete).toBeFalsy();
        });
      });

      describe('on update', function() {
        beforeEach(function() {
          task.id = 66;
          task.save();
          request = server.requests[0];
        });

        it('should be PUT', function() {
          expect(request.method).toEqual('PUT');
        });

        it('should be sync', function() {
          expect(request.async).toBeTruthy();
        });

        it('should have valid url', function() {
          expect(request.url).toEqual('/tasks/66.json')
        });

        it('should send valid data', function() {
          var params = JSON.parse(request.requestBody);
          expect(params.task).toBeDefined();
          expect(params.task.name).toEqual('New task to do');
          expect(params.task.complete).toBeFalsy();
        });
      });
    });
  });

});
