(function (){
  var driventsName = ['drivent-bdc', 'drivent-bd0']
  var virtualDeviceBodyTemplate =
	{
	  title: "",
		cells: {
		  "state": {
			title: "Состояние",
			type: "text",
			value: "",
			order: 10
        },
  		  "Level": {
			title: "Уровень",
			type: "range",
			value: 0,
			min: 0,
			max: 100,
			order: 20
		},
		  "btnOpen": {
			title: "Открыть",
			type: "pushbutton",
			value: false,
			order: 30
		},
		  "btnStop": {
			title: "Стоп",
			type: "pushbutton",
			value: false,
			order: 40
		},
		  "btnClose": {
			title: "Закрыть",
			type: "pushbutton",
			value: false,
			order: 50
		}
	}
  };
  driventsName.forEach(function(driventName) {
    
    log.debug("Create drivent: {}".format(driventName));
    virtualDeviceBodyTemplate.title = driventName;
  	defineVirtualDevice(driventName, virtualDeviceBodyTemplate);
    
    trackMqtt(driventName + "/LWT", function(message) {
      log.debug("message.value: {}:{}".format(message.topic, message.value));
      if (message.value == 0)
        dev["{}/state".format(driventName)] = "Не на связи"
      ;
    });
    
    trackMqtt(driventName + "/CurrentPosition", function(message) {
      log.debug("message.value: {}:{}".format(message.topic, message.value));
      dev["{}/Level".format(driventName)] = Number(message.value)
    });

    trackMqtt(driventName + "/getObstructionDetected", function(message) {
      log.debug("message.value: {}:{}".format(message.topic, message.value));
      if (message.value == true)
        dev["{}/state".format(driventName)] = "Защемление"
      ;
    });

    trackMqtt(driventName + "/State", function(message) {
      log.debug("message.value: {}:{}".format(message.topic, message.value));
      if (message.value == "INCREASING")
        dev["{}/state".format(driventName)] = "Открывается"
      else if (message.value == "DECREASING")
        dev["{}/state".format(driventName)] = "Закрывается"
      else if (message.value == "STOPPED")
        dev["{}/state".format(driventName)] = "Ожидание"
      else if (message.value == "ALARM1")
        dev["{}/state".format(driventName)] = "Слишком много команд"
      else if (message.value == "ALARM2")
        dev["{}/state".format(driventName)] = "Перегрузка привода"
      ;
    });
    
    defineRule("click_{}_btnOpen".format(driventName), {
        whenChanged: "{}/btnOpen".format(driventName),
        then: function (newValue, devName, ControlName) {
          publish("{}/setTargetPosition".format(driventName), "100");
        }
    });

    defineRule("click_{}_btnStop".format(driventName), {
        whenChanged: "{}/btnStop".format(driventName),
        then: function (newValue, devName, ControlName) {
          publish("{}/setTargetPosition".format(driventName), "STOP");
        }
    });

    defineRule("click_{}_btnClose".format(driventName), {
        whenChanged: "{}/btnClose".format(driventName),
        then: function (newValue, devName, ControlName) {
          publish("{}/setTargetPosition".format(driventName), "0");
        }
    });
    
  });
  
})();