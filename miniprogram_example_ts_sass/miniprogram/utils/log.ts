export function clog(logInfo: string, logGroupName: string, logType: 'log' | 'warn' | 'error' | 'info' = 'log'): void {
	console.group(logGroupName);
	switch (logType) {
		case 'log':
			console.log(logInfo);
			break;
		case 'warn':
			console.warn(logInfo);
			break;
		case 'error':
			console.error(logInfo);
			break;
		case 'info':
			console.info(logInfo);
			break;
		default:
			break;
	}
	console.groupEnd();
}