/// <reference types="node" />

/** Describe a flex-progress element */
export interface Element {
	/** Fixed width element */
	width?: number;
	/** Mimimum width */
	minWidth?: number;
	/** Maximum width */
	maxWidth?: number;
	/** Flexing factor, set both grow and shrink */
	flex: number;
	/** Grow factor */
	flexGrow: number;
	/** Shrink factor */
	flexShrink: number;
	/** The active state of the element */
	enabled: boolean;
	/** Calculate uninhibited width */
	calculateWidth(): number;
	/** Render item with max-width */
	render(maxWidth?: number): string;
	/** Trigger an update */
	update(): void;
}
/** Describe a child element */
export interface ChildElement extends Element {
	parent?: ParentElement;
}
/** Describe a parent element */
export interface ParentElement extends Element {
	/** Array of child elements */
	children: ChildElement[];
	/** Add element */
	add(child: ChildElement, atIndex?: number): ChildElement;
	/** Remove element */
	remove(child: ChildElement): ChildElement | undefined;
	/** Clear all elements */
	clear(): void;
	update(child?: ChildElement): void;
	/** Add elements to the end.
	 * @param {...ChildElement} items ... of child element
	 */
	append(...items: ChildElement[]): void;
	/** Syncing events */
	sync(): Promise<number>;
}
/** Describe options to class Item constructor() */
export interface ItemOptions {
	/** Fixed width element */
	width?: number;
	/** Mimimum width */
	minWidth?: number;
	/** Maximum width */
	maxWidth?: number;
	/** Flexing factor, set both grow and shrink */
	flex?: {
		/** Grow factor */
		grow?: number;
		/** Shrink factor */
		shrink?: number;
	} | number;
	/** Post process values */
	postProcess?: (...values: string[]) => string;
}
/** Abstract class implementing the most basic functions for a ChildElement. */
export declare abstract class Item implements ChildElement {
	private $parent?;
	private $minWidth;
	private $maxWidth;
	private $flexGrow;
	private $flexShrink;
	private $postProcess?;
	private $updating;
	private $enabled;
	constructor(options?: ItemOptions);
	/** The active state of the element */
	enabled: boolean;
	/** Mimimum width */
	minWidth: number;
	/** Maximum width */
	maxWidth: number;
	/** Set fixed width item */
	width: number;
	/** Check if item is flexible */
	readonly isFlexible: boolean;
	/** Flex grow factor */
	flexGrow: number;
	/** Flex shrink factor */
	flexShrink: number;
	/** Flexing factor, set both grow and shrink */
	flex: number;
	/** Set/unset parent element */
	parent: ParentElement | undefined;
	/** Results wrapper */
	private wrap;
	/** Handle update events */
	protected handleUpdate(): void;
	/** Schedule an update */
	update(): void;
	/** Call when parent is set */
	protected didMount(_parent: ParentElement): void;
	/** Call when parent is unset */
	protected willUnmount(_parent: ParentElement): void;
	/** Render this item */
	render(maxWidth?: number): string;
	/** Calculate this item width */
	calculateWidth(): number;
	/** Handle render event */
	protected abstract handleRender(maxWidth?: number): string | string[];
	/** Handle calculate-width event */
	protected abstract handleCalculateWidth(): number;
}
export declare type FlexChild = ChildElement | string | number;
/** A group of ChildElement */
export declare class Group extends Item implements ParentElement {
	readonly children: ChildElement[];
	private flexGrowSum;
	private growable;
	private shrinkable;
	private $startTime;
	readonly flexGrow: number;
	readonly flexShrink: number;
	private $added;
	private $removed;
	private static $castChild;
	add(item: FlexChild, atIndex?: number): ChildElement;
	remove(item: ChildElement): ChildElement | undefined;
	append(...items: FlexChild[]): void;
	clear(): void;
	private $syncActual;
	private $sync;
	sync(): Promise<number>;
	protected handleCalculateWidth(): number;
	protected handleRender(maxWidth?: number): string[];
	private newFlexState;
	private growRound;
	private grow;
	private shrinkRound;
	private shrink;
}
/** Text alignment */
export declare const enum TextAlignment {
	Left = "left",
	Center = "center",
	Right = "right"
}
/** Describe options to class Text constructor() */
export interface TextOptions extends ItemOptions {
	text?: string;
	more?: string;
	align?: TextAlignment;
}
/** A text element */
export declare class Text extends Item {
	private $text;
	private $more;
	align: TextAlignment;
	constructor(options?: TextOptions | string);
	/** Text to display */
	text: string;
	/** The raw text width */
	readonly length: number;
	protected handleCalculateWidth(): number;
	protected handleRender(maxWidth?: number): string;
	/** Grow text to width */
	private grow;
	/** Shrink text to width */
	private shrink;
}
/** Empty space element */
export declare class Space extends Item {
	constructor(options?: ItemOptions | number);
	protected handleCalculateWidth(): number;
	protected handleRender(maxWidth?: number): string;
}
/** Describe Spinner theme */
export interface SpinnerTheme {
	frames: string[];
	interval: number;
	width?: number;
}
/** Describe options to class Spinner constructor() */
export interface SpinnerOptions extends ItemOptions {
	theme?: SpinnerTheme;
}
/** Busy Spinner */
export declare class Spinner extends Item {
	width: number;
	frameOffset: number;
	private pFrame;
	private pTheme;
	private pTime;
	private pAutoTicking;
	constructor(options?: SpinnerOptions);
	tick(interval?: number): void;
	autoTicking: boolean;
	/** Style to display spinner as */
	theme: SpinnerTheme;
	enabled: boolean;
	didMount(_parent: ParentElement): void;
	private pStartActual;
	private pStart;
	/** Synchronization function */
	private pHandleSync;
	protected handleCalculateWidth(): number;
	protected handleRender(maxWidth?: number): string;
}
/** Describe a progress theme to class Bar constructor() */
export interface BarTheme {
	symbols: string[];
}
/** Describe options to class Bar constructor() */
export interface BarOptions extends ItemOptions {
	theme?: BarTheme;
	ratio?: number;
}
/** A progress bar */
export declare class Bar extends Item {
	theme: BarTheme;
	private $ratio;
	constructor(options?: BarOptions);
	/** Completion ratio, range from 0 to 1 */
	ratio: number;
	/** Turn data to display string */
	static renderBar(symbols: string[], ratio: number, width: number): string[];
	protected handleCalculateWidth(): number;
	protected handleRender(maxWidth?: number): string[] | "";
}
/** Hide console cursor, this can only work when added to an Output stream. */
export declare class HideCursor extends Item {
	/** HideCursor doesn't accept any options */
	constructor();
	/** Set cursor visible state */
	static setCursor(stream: NodeJS.WriteStream, visible: boolean): void;
	didMount(parent: ParentElement): void;
	willUnmount(parent: ParentElement): void;
	protected handleCalculateWidth(): number;
	protected handleRender(_maxWidth?: number): string;
}
/** Describe options to class Output constructor() */
export interface OutputOptions extends ItemOptions {
	stream?: NodeJS.WriteStream;
}
/** Actual output to stderr */
export declare class Output extends Group {
	readonly stream: NodeJS.WriteStream;
	readonly isTTY: boolean;
	private $lastColumns;
	private $lastWidth;
	private $createdTime;
	count: number;
	constructor(options?: OutputOptions);
	enabled: boolean;
	/** Elapsed time since creation */
	readonly elapsed: number;
	/** Clear display line */
	clearLine(): void;
	clear(clearLine?: boolean): void;
	/** Get display width */
	readonly columns: number;
	protected handleUpdate(): void;
}