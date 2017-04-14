import {
    Component,
    OnInit,
    OnDestroy,
    AfterViewInit,
    Input,
    Output,
    ViewChild,
    EventEmitter,
    NgZone,
    forwardRef,
    QueryList,
    ContentChildren
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

import {CKEditorService} from './ckeditor.service';
import {CtgService} from '../ctg/ctg.service';

// import {CKButtonDirective} from "./ckbutton.directive";
// import {CKGroupDirective} from "./ckgroup.directive";

declare let CKEDITOR: any;

/**
 * CKEditor component
 * Usage :
 *  <ckeditor [(ngModel)]="data" [config]="{...}" debounce="500"></ckeditor>
 */
@Component({
               selector:    'ckeditor',
               providers:   [
                   {
                       provide:     NG_VALUE_ACCESSOR,
                       useExisting: forwardRef(() => CKEditorComponent),
                       multi:       true
                   }
               ],
               templateUrl: './html/ckeditor.component.html',
               styleUrls:   ['./scss/ckeditor.component.scss']
           })
export class CKEditorComponent implements OnInit, OnDestroy, AfterViewInit {

    @Input() config;
    @Input() debounce;

    @Output() change = new EventEmitter();
    @Output() ready  = new EventEmitter();
    @Output() blur   = new EventEmitter();
    @Output() focus  = new EventEmitter();
    @ViewChild('host') host;
    // @ContentChildren(CKButtonDirective) toolbarButtons: QueryList<CKButtonDirective>;
    // @ContentChildren(CKGroupDirective) toolbarGroups: QueryList<CKGroupDirective>;

    debounceTimeout;
    zone;

    private editor = 'editor';

    private content = this.ctgService.ctgContent;

    private subscriptionToggleEditor: Subscription;

    private subscriptionCtgContent: Subscription;

    /**
     * Constructor
     */
    constructor(
        zone: NgZone,
        private ckeditorService: CKEditorService,
        private ctgService: CtgService,
    ) {
        this.zone = zone;

    }

    ngOnInit() {
        this.subscriptionCtgContent = this.ctgService.ctgContent$.subscribe(
            (content: string) => {
                if (CKEDITOR.instances[this.editor]) {
                    CKEDITOR.instances[this.editor].setData(this.content);
                }
            }
        );

        this.subscriptionToggleEditor = this.ckeditorService.toggleEditor$.subscribe(
            (toggle: boolean) => {
                if (!toggle) {
                    //close editor
                    if (CKEDITOR.instances[this.editor]) {
                        CKEDITOR.instances[this.editor].focusManager.blur(true);
                        CKEDITOR.instances[this.editor].destroy();
                    }
                }

            }
        )
    }

    /**
     * On component destroy
     */
    ngOnDestroy() {
        setTimeout(() => {
            if (CKEDITOR.instances[this.editor]) {
                CKEDITOR.instances[this.editor].removeAllListeners();
                CKEDITOR.instances[this.editor].focusManager.blur(true);
                CKEDITOR.instances[this.editor].destroy();
                CKEDITOR.instances[this.editor] = null;
            }
        });
    }

    /**
     * On component view init
     */
    ngAfterViewInit() {

        CKEDITOR.disableAutoInline = true;
        // Configuration
        this.ckeditorInit(this.config || {});
    }


    /**
     * Value update process
     */
    // updateValue(value) {
    //     this.zone.run(() => {
    //         this.value = value;
    //
    //         this.onChange(value);
    //
    //         this.onTouched();
    //         this.change.emit(value);
    //     });
    // }

    /**
     * CKEditor init
     */
    ckeditorInit(config) {
        if (typeof CKEDITOR == 'undefined') {
            console.warn('CKEditor 4.x is missing (http://ckeditor.com/)');

        } else {

            CKEDITOR.inline(this.editor);
            // CKEditor replace textarea
            // this.instance = CKEDITOR.replace(this.host.nativeElement, config);

            // Set initial value
            CKEDITOR.instances[this.editor].setData(this.content);

            // // listen for instanceReady event
            // this.instance.on('instanceReady', (evt) => {
            //     // send the evt to the EventEmitter
            //     this.ready.emit(evt);
            // });
            //
            // // CKEditor change event
            // this.instance.on('change', () => {
            //     this.onTouched();
            //     let value = this.instance.getData();
            //
            //     // Debounce update
            //     if (this.debounce) {
            //         if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
            //         this.debounceTimeout = setTimeout(() => {
            //             this.updateValue(value);
            //             this.debounceTimeout = null;
            //         }, parseInt(this.debounce));
            //
            //         // Live update
            //     } else {
            //         this.updateValue(value);
            //     }
            // });
            //
            // // CKEditor blur event
            // this.instance.on('blur', (evt) => {
            //     this.blur.emit(evt);
            // });
            //
            // // CKEditor focus event
            // this.instance.on('focus', (evt) => {
            //     this.focus.emit(evt);
            // });

            // // Add Toolbar Groups to Editor. This will also add Buttons within groups.
            // this.toolbarGroups.forEach((group) => {
            //     group.initialize(this)
            // });
            // // Add Toolbar Buttons to Editor.
            // this.toolbarButtons.forEach((button) => {
            //     button.initialize(this);
            // });

        }
    }

    /**
     * Implements ControlValueAccessor
     */
    // writeValue(value) {
    //     if (CKEDITOR.instances[this.editor])
    //         CKEDITOR.instances[this.editor].setData(value);
    // }

    onChange(_) {
    }

    onTouched() {
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }
}