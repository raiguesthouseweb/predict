import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SystemLogsProps {
  logs: string[];
}

export function SystemLogs({ logs }: SystemLogsProps) {
  // Add timestamps to logs
  const logsWithTimestamps = logs.map((log, index) => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + index * 3); // Simulate time progression
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const timestamp = `${hours}:${minutes}:${seconds}`;
    
    // Determine log type based on content
    let logType = 'SYSTEM';
    if (log.includes('pitch') || log.includes('ground') || log.includes('boundary')) {
      logType = 'DATA';
    } else if (log.includes('analyzing') || log.includes('calculating') || log.includes('evaluating')) {
      logType = 'ANALYSIS';
    } else if (log.includes('jersey') || log.includes('color')) {
      logType = 'COLOR THEORY';
    } else if (log.includes('previous matches') || log.includes('history')) {
      logType = 'HEAD-TO-HEAD';
    }
    
    return { timestamp, message: log, type: logType };
  });
  
  return (
    <Card className="bg-card border-primary/20 shadow-lg h-full">
      <CardHeader className="border-b border-primary/20 px-4 py-3">
        <CardTitle className="font-orbitron text-primary">System Activity</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        {/* Radar Display */}
        <div className="flex justify-center mb-6">
          <div className="radar-scan">
            <div className="radar-beam"></div>
          </div>
        </div>
        
        {/* System Logs */}
        <div className="space-y-3 text-sm max-h-[400px] overflow-y-auto">
          {logs.length === 0 ? (
            <div className="bg-background rounded-md p-3 border border-primary/10">
              <div className="flex items-center text-green-400 mb-1">
                <span className="text-xs mr-2">[--:--:--]</span>
                <span>SYSTEM</span>
              </div>
              <p className="text-muted-foreground">System idle. Waiting for prediction request...</p>
            </div>
          ) : (
            logsWithTimestamps.map((log, index) => (
              <div key={index} className="bg-background rounded-md p-3 border border-primary/10">
                <div className="flex items-center text-green-400 mb-1">
                  <span className="text-xs mr-2">[{log.timestamp}]</span>
                  <span>{log.type}</span>
                </div>
                <p className="text-muted-foreground">{log.message}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
