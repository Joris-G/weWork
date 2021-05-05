import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-instruction',
  templateUrl: './edit-instruction.component.html',
  styleUrls: ['./edit-instruction.component.css']
})
export class EditInstructionComponent implements OnInit {
  @Input() instruction: any;

  constructor() { }

  ngOnInit(): void {
  }

}
