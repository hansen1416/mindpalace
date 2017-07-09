import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    Output,
    ViewChild,
    EventEmitter,
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {CKEditorService} from './ckeditor.service';
import {CtgService} from '../ctg/ctg.service';

declare let CKEDITOR: any;


@Component({
               selector:    'ckeditor',
               templateUrl: './html/ckeditor.component.html',
               styleUrls:   ['./scss/ckeditor.component.scss']
           })
export class CKEditorComponent implements OnInit, OnDestroy, AfterViewInit {


    @Output() private change = new EventEmitter();

    @ViewChild('host') private host;

    public editor: string = 'editor';

    public content: string = this.ctgService.ctgContent;

    private subscriptionToggleEditor: Subscription;

    private subscriptionCtgContent: Subscription;
    //when initialize content, do not emit change event
    //useful when content editor is open and click multiple ctg sprite
    private initialContent: boolean = true;
    //after initialize content, trigger content initialize event, ask the ctgContentComponent hide save button
    //useful when change one ctg content and click another ctg without save previous edit content
    @Output() private contentInitial = new EventEmitter();

    /**
     * Constructor
     */
    constructor(
        // zone: NgZone,
        private ckeditorService: CKEditorService,
        private ctgService: CtgService,
    ) {
        // this.zone = zone;
    }

    ngOnInit() {

        this.subscriptionCtgContent = this.ctgService.ctgContent$.subscribe(
            (content: string) => {
                if (CKEDITOR.instances[this.editor]) {
                    CKEDITOR.instances[this.editor].setData(content);
                    this.initialContent = true;
                    this.contentInitial.emit();
                }
            }
        );

        this.subscriptionToggleEditor = this.ckeditorService.toggleEditor$.subscribe(
            (toggle: boolean) => {
                if (!toggle) {
                    //close editor, only blur
                    //the editor will bs destroyed in ngDestroy
                    if (CKEDITOR.instances[this.editor]) {
                        CKEDITOR.instances[this.editor].focusManager.blur(true);
                    }
                }
            }
        );
    }

    /**
     * On component view init
     */
    ngAfterViewInit() {
        CKEDITOR.disableAutoInline = true;
        // Configuration
        this.ckeditorInit();
    }

    /**
     * On component destroy
     */
    ngOnDestroy() {
        if (CKEDITOR.instances[this.editor]) {
            //must blur, before destroy the editor, otherwise will be error
            CKEDITOR.instances[this.editor].focusManager.blur(true);
            CKEDITOR.instances[this.editor].destroy();
        }
    }

    /**
     * CKEditor init
     */
    ckeditorInit() {
        if (typeof CKEDITOR == 'undefined') {
            return;
        }

        CKEDITOR.inline(this.host.nativeElement);
        // Set initial value
        CKEDITOR.instances[this.editor].setData(this.content);
        //content change event
        CKEDITOR.instances[this.editor].on('change', this.onChange);
    }

    /**
     * focus on the editor
     */
    showEditor() {
        if (CKEDITOR.instances[this.editor]) {
            CKEDITOR.instances[this.editor].focusManager.focus(true);
        }
    }

    /**
     * synchronize content to property content
     * used in parent component saveCtgContent(content)
     */
    private onChange = () => {
        this.content = CKEDITOR.instances[this.editor].getData();
        if (!this.initialContent) {
            this.change.emit();
        }
        this.initialContent = false;
    };


}