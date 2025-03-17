import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentTime: string;
  private intervalId: any;

  constructor() {
    this.currentTime = this.getCurrentTime();
  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.currentTime = this.getCurrentTime();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  private getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }
}
