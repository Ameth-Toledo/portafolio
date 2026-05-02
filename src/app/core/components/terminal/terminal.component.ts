import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TerminalCommand {
  command: string;
  output?: string;
  outputColor?: string;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="terminal">
      <div class="terminal-header">
        <div class="terminal-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="terminal-title">{{ title }}</span>
      </div>
      <div class="terminal-body">
        @for (cmd of commands; track $index) {
          <div class="line">
            <span class="prompt">$</span>
            <span class="typed-text">{{ typedCommands[$index] || '' }}</span>
            @if (isTyping[$index]) {
              <span class="cursor"></span>
            }
          </div>
          @if (cmd.output && commandFinished[$index]) {
            <div class="output" [style.color]="cmd.outputColor || '#7ee787'">
              {{ cmd.output }}
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .terminal {
      background: #0d1117;
      border-radius: 8px;
      overflow: hidden;
      font-family: 'Fira Code', 'Consolas', 'Courier New', monospace;
      font-size: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      border: 1px solid #30363d;
      width: 100%;
    }
    .terminal-header {
      background: #161b22;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #30363d;
    }
    .terminal-dots {
      display: flex;
      gap: 6px;
    }
    .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    .dot-red { background: #ff5f56; }
    .dot-yellow { background: #ffbd2e; }
    .dot-green { background: #27c93f; }
    .terminal-title {
      color: #8b949e;
      font-size: 12px;
      margin-left: 8px;
    }
    .terminal-body {
      padding: 16px;
      min-height: 80px;
      color: #c9d1d9;
    }
    .line {
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    .prompt {
      color: #58a6ff;
      margin-right: 8px;
      font-weight: bold;
    }
    .typed-text {
      color: #c9d1d9;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .cursor {
      display: inline-block;
      width: 8px;
      height: 18px;
      background: #58a6ff;
      animation: blink 1s infinite;
      margin-left: 2px;
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
    .output {
      margin: 4px 0 12px 20px;
      white-space: pre-wrap;
      word-break: break-word;
      color: #7ee787;
    }
    @media (max-width: 767px) {
      .terminal { max-width: 100%; font-size: 12px; }
      .terminal-body { padding: 12px; }
    }
  `]
})
export class TerminalComponent implements OnInit, OnDestroy {
  @Input() title: string = 'Terminal';
  @Input() commands: TerminalCommand[] = [];
  
  typedCommands: string[] = [];
  isTyping: boolean[] = [];
  commandFinished: boolean[] = [];
  private intervals: any[] = [];

  ngOnInit() {
    this.typeCommands();
  }

  ngOnDestroy() {
    this.intervals.forEach(clearInterval);
  }

  private typeCommands() {
    let currentCommand = 0;
    this.typedCommands = this.commands.map(() => '');
    this.isTyping = this.commands.map(() => false);
    this.commandFinished = this.commands.map(() => false);

    const typeNext = () => {
      if (currentCommand >= this.commands.length) return;
      
      this.isTyping[currentCommand] = true;
      let charIndex = 0;
      const command = this.commands[currentCommand].command;
      
      const interval = setInterval(() => {
        if (charIndex < command.length) {
          this.typedCommands[currentCommand] = command.substring(0, charIndex + 1);
          charIndex++;
        } else {
          clearInterval(interval);
          this.isTyping[currentCommand] = false;
          this.commandFinished[currentCommand] = true;
          currentCommand++;
          setTimeout(typeNext, 300);
        }
      }, 50);
      
      this.intervals.push(interval);
    };

    setTimeout(typeNext, 500);
  }
}
