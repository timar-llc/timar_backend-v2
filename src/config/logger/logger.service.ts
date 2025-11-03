import { Injectable } from '@nestjs/common';
import * as net from 'net';

@Injectable()
export class LoggerService {
  private client: net.Socket;
  private isConnected = false;

  constructor() {
    console.log('🔧 LoggerService: Initializing custom logger...');

    this.client = new net.Socket();
    this.connectToLogstash();
  }

  private connectToLogstash() {
    this.client.connect(5044, '127.0.0.1', () => {
      console.log('✅ Connected to Logstash');
      this.isConnected = true;
    });

    this.client.on('error', (error) => {
      console.error('❌ Logstash connection error:', error.message);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      console.log('🔌 Logstash connection closed');
      this.isConnected = false;
    });
  }

  private sendLog(
    level: string,
    message: string,
    context?: string,
    additionalData?: any,
  ) {
    const logData = {
      level: level.toUpperCase(),
      message,
      context,
      service: 'timar-backend',
      timestamp: new Date().toISOString(),
      ...additionalData,
    };

    // Всегда выводим в консоль
    console.log(
      `[${level.toUpperCase()}] ${message}`,
      context ? `(${context})` : '',
    );

    // Отправляем в Logstash если подключены
    if (this.isConnected) {
      try {
        this.client.write(JSON.stringify(logData) + '\n');
      } catch (error) {
        console.error('❌ Failed to send log to Logstash:', error);
      }
    } else {
      console.warn('⚠️ Logstash not connected, log not sent');
    }
  }

  log(message: string, context?: string) {
    this.sendLog('info', message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.sendLog('error', message, context, { trace });
  }

  warn(message: string, context?: string) {
    this.sendLog('warn', message, context);
  }

  debug(message: string, context?: string) {
    this.sendLog('debug', message, context);
  }

  verbose(message: string, context?: string) {
    this.sendLog('verbose', message, context);
  }

  info(message: string, context?: string) {
    this.sendLog('info', message, context);
  }
}
