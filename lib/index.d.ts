/// <reference types="node" />

export interface Element {
	width?: number;
	minWidth?: number;
	maxWidth?: number;
	flex: number;
	flexGrow: number;
	flexShrink: number;
	enabled: boolean;
	calculateWidth(): number;
	render(maxWidth?: number): string;
	update(): void;
}
export interface ChildElement extends Element {
	parent?: ParentElement;
}
export interface ParentElement extends Element {
	children: ChildElement[];
	add(child: ChildElement, atIndex?: number): ChildElement;
	remove(child: ChildElement): ChildElement | undefined;
	clear(): void;
	append(...items: ChildElement[]): void;
	sync(): Promise<number>;
}
export interface ItemOptions {
	width?: number;
	minWidth?: number;
	maxWidth?: number;
	flex?: {
		grow?: number;
		shrink?: number;
	} | number;
	postProcess?: (...values: string[]) => string;
}
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
	enabled: boolean;
	minWidth: number;
	maxWidth: number;
	width: number;
	readonly isFlexible: boolean;
	flexGrow: number;
	flexShrink: number;
	flex: number;
	parent: ParentElement | undefined;
	private wrap;
	protected handleUpdate(): void;
	update(): void;
	protected didMount(_parent: ParentElement): void;
	protected willUnmount(_parent: ParentElement): void;
	render(maxWidth?: number): string;
	calculateWidth(): number;
	protected abstract handleRender(maxWidth?: number): string | string[];
	protected abstract handleCalculateWidth(): number;
}
export declare type FlexChild = ChildElement | string | number;
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
export declare const enum TextAlignment {
	Left = "left",
	Center = "center",
	Right = "right"
}
export interface TextOptions extends ItemOptions {
	text?: string;
	more?: string;
	align?: TextAlignment;
}
export declare class Text extends Item {
	private $text;
	private $more;
	align: TextAlignment;
	constructor(options?: TextOptions | string);
	text: string;
	readonly length: number;
	protected handleCalculateWidth(): number;
	protected handleRender(maxWidth?: number): string;
	private grow;
	private shrink;
}
export declare class Space extends Item {
	constructor(options?: ItemOptions | number);
	protected handleCalculateWidth(): number;
	protected handleRender(maxWidth?: number): string;
}
export interface SpinnerTheme {
	frames: string[];
	interval: number;
	width?: number;
}
export interface SpinnerOptions extends ItemOptions {
	theme?: SpinnerTheme;
}
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
	theme: SpinnerTheme;
	enabled: boolean;
	didMount(_parent: ParentElement): void;
	private pStartActual;
	private pStart;
	private pHandleSync;
	protected handleCalculateWidth(): number;
	protected handleRender(maxWidth?: number): string;
}
export interface BarTheme {
	symbols: string[];
}
export interface BarOptions extends ItemOptions {
	theme?: BarTheme;
	ratio?: number;
}
export declare class Bar extends Item {
	theme: BarTheme;
	private $ratio;
	constructor(options?: BarOptions);
	ratio: number;
	static renderBar(symbols: string[], ratio: number, width: number): string[];
	protected handleCalculateWidth(): number;
	protected handleRender(maxWidth?: number): string[] | "";
}
export interface OutputOptions extends ItemOptions {
	stream?: NodeJS.WriteStream;
}
export declare class Output extends Group {
	readonly stream: NodeJS.WriteStream;
	readonly isTTY: boolean;
	private $lastColumns;
	private $lastWidth;
	private $createdTime;
	count: number;
	constructor(options?: OutputOptions);
	enabled: boolean;
	readonly elapsed: number;
	clearLine(): void;
	clear(): void;
	readonly columns: number;
	protected handleUpdate(): void;
}