function testConnection() {
  Logger.log('--- STARTING DEBUG ---');
  
  // Simulate the exact request failing in the browser
  const e = {
    pathInfo: '/api/talents',
    parameter: { verified_only: 'false' },
    method: 'GET'
  };
  
  try {
    Logger.log('Calling doGet...');
    const result = doGet(e);
    Logger.log('doGet returned successfully');
    
    // Check if result is valid
    if (!result) {
      Logger.log('ERROR: Result is null/undefined');
    } else {
      Logger.log('Result content type: ' + result.getMimeType());
      Logger.log('Result content: ' + result.getContent());
    }
    
  } catch (error) {
    Logger.log('!!! CRASHED !!!');
    Logger.log('Error: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
  }
  
  Logger.log('--- END DEBUG ---');
}
