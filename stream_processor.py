from kafka import KafkaConsumer, KafkaProducer
import requests, json


#conf
bootstrap_servers = 'localhost:9092'
input_topic = 'raw-weather'
output_topic = 'proc-weather'

#consum
consumer = KafkaConsumer(input_topic,bootstrap_servers=bootstrap_servers,value_deserializer=lambda x: json.loads(x.decode('utf-8')))

#produc
producer = KafkaProducer(bootstrap_servers=bootstrap_servers,value_serializer=lambda x: json.dumps(x).encode('utf-8'))


for message in consumer:
    #uzmi json fajl
    json_data = message.value
    
    # ove procesiras
    temperature_kelvin = float(json_data['main']['temp']) # 280
    temperature_celsius = temperature_kelvin - 273.15
    print(temperature_celsius)

    processed_data = {
        
        'city': json_data.get('name','Unknown City'),
        'temperature_celsius': round(temperature_celsius,2),
        'dt': json_data.get('dt','error no date')

    }

    producer.send(output_topic, value=processed_data)
    producer.flush()


#nikad
consumer.close()
producer.close()
