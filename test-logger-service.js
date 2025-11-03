const { LoggerService } = require('./dist/config/logger/logger.service');

console.log('🧪 Testing LoggerService...');

try {
  const logger = new LoggerService();

  console.log('📤 Sending test log...');
  logger.log(
    'TEST LOG from LoggerService - Should appear in Kibana!',
    'TestService',
  );

  setTimeout(() => {
    console.log('✅ Test completed. Check if log appeared in Elasticsearch.');
  }, 2000);
} catch (error) {
  console.error('❌ Error testing LoggerService:', error);
}
