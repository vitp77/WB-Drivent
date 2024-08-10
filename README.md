# WB-Drivent
Скрипт виртуального устройства для  WirenBoard

Как подключить:
1. В самих устройствах Drivent необходиом настроить подключение к MQTT
2. Скопировать скрипт wb-drivent.js на устройство WirenBoard в папку /mnt/data/etc/wb-rules
3. Открыть скрипт редактором и во второй строке для перменной driventsName задать имена Ваших устройств Drivent
   
```js
(function (){
  var driventsName = ['drivent-bdc', 'drivent-bd0']
  var virtualDeviceBodyTemplate =
	{

 ...

```
 
5. После сохранения на панели устройств появяится ождноименные устройства с элементами управления

![изображение](./doc/drivent.png)
