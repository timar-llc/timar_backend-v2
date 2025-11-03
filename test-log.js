const net = require('net');

console.log('Testing Logstash -> Elasticsearch pipeline...');

const client = new net.Socket();

client.connect(5044, '127.0.0.1', () => {
  console.log('✅ Connected to Logstash');

  const testLog = {
    level: 'INFO',
    message: 'TEST LOG - Please appear in Kibana!',
    context: 'TestService',
    timestamp: new Date().toISOString(),
    service: 'timar-backend',
  };

  console.log('📤 Sending log:', JSON.stringify(testLog, null, 2));
  client.write(JSON.stringify(testLog) + '\n');

  setTimeout(() => {
    client.end();
    console.log('✅ Log sent. Checking Elasticsearch in 3 seconds...');

    setTimeout(() => {
      const { exec } = require('child_process');
      console.log('\n🔍 Checking Elasticsearch...');

      exec('curl -s "localhost:9200/nestjs/_count?pretty"', (error, stdout) => {
        console.log('📊 Document count:', stdout);

        exec(
          'curl -s "localhost:9200/nestjs/_search?pretty&size=1" | grep -A 10 "_source"',
          (error, stdout) => {
            if (stdout) {
              console.log('✅ SUCCESS: Documents found!');
              console.log('Sample document:', stdout);
            } else {
              console.log('❌ PROBLEM: No documents in index!');
            }
          },
        );
      });
    }, 3000);
  }, 1000);
});

client.on('error', (error) => {
  console.error('❌ Cannot connect to Logstash:', error.message);
});
