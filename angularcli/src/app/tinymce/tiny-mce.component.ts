import {Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';

declare let tinymce: any;

@Component({
               selector   : 'tiny-mce',
               templateUrl: 'html/tiny-mce.component.html',
               styleUrls  : ['scss/tiny-mce.component.scss']
           })
export class TinyMceComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() elementId: string;
    @Output() onEditorKeyUp = new EventEmitter<any>();

    editor;

    constructor() { }

    ngOnInit() {

    }

    ngAfterViewInit() {

        let ele = document.getElementById(this.elementId);

        console.log(ele.parentElement.clientHeight);

        tinymce.init({
                         selector: '#' + this.elementId,
                         inline  : true,
                         plugins : [
                             'advlist autolink lists link image charmap print preview anchor',
                             'searchreplace visualblocks code fullscreen',
                             'insertdatetime media table contextmenu paste'
                         ],
                         toolbar : 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
                         skin_url: location.protocol + '//' + location.host + '/assets/skins/lightgray',
                         setup   : editor => {
                             this.editor = editor;
                             editor.on('keyup', () => {
                                 const content = editor.getContent();
                                 this.onEditorKeyUp.emit(content);
                             });
                         },
                     });
    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
    }
}
