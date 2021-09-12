import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-host-listener',
  templateUrl: './host-listener.component.html',
  styleUrls: ['./host-listener.component.scss']
})
export class HostListenerComponent {

  @ViewChild('player', { static: true }) player!: ElementRef<HTMLDivElement>;

  @HostListener('document:keydown', ['$event.key'])
  handleKey(event: string): void {
    this.movePlayer(event);
  }

  @HostListener('document:click', ['$event.target'])
  handleClick($event: HTMLElement): void {
    const NAME_CLASS: string = $event.classList.toString();
    this.changeImage(NAME_CLASS);
  }

  public image: string[];

  constructor(
    private render2: Renderer2
  ) {
    this.image= [
      '../../assets/img/mWk2Z4c.png',
      '../../assets/img/4fgT9tx.png'
    ];
  }

  movePlayer(nameKey: string): void {
    const playerEl = this.player.nativeElement;

    if (nameKey === 'ArrowRight') {
      const PARSE_VALUE: number = Number(playerEl.style.left.replace('px', ''));
      this.render2.setStyle(playerEl, 'left', `${PARSE_VALUE + 50}px`);
    }

    if (nameKey === 'ArrowLeft') {
      const PARSE_VALUE: number = Number(playerEl.style.left.replace('px', ''));
      this.render2.setStyle(playerEl, 'left', `${PARSE_VALUE - 50}px`);
    }

    if (nameKey === 'ArrowUp') {
      this.render2.addClass(playerEl, 'jump-player');
      setTimeout(() => {
        this.render2.removeClass(playerEl, 'jump-player');
      }, 2000)
    }
  }

  changeImage(name: string): void {
    if (name === 'player-image') {
      this.image.reverse();
      setTimeout(() => {
        this.image.reverse();
      }, 1000)
    }
  }

}
