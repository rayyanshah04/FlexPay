declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
}

declare module 'react-native-view-shot' {
    import { Component } from 'react';
    import { ViewProps } from 'react-native';

    export interface CaptureOptions {
        format?: 'png' | 'jpg' | 'webm' | 'raw';
        quality?: number;
        result?: 'tmpfile' | 'base64' | 'data-uri' | 'zip-base64';
        snapshotContentContainer?: boolean;
    }

    export default class ViewShot extends Component<ViewProps & { options?: CaptureOptions }> {
        capture(): Promise<string>;
    }

    export function captureRef<T = any>(
        view: number | React.RefObject<T>,
        options?: CaptureOptions
    ): Promise<string>;

    export function releaseCapture(uri: string): void;
    export function captureScreen(options?: CaptureOptions): Promise<string>;
}

declare module 'react-native-share' {
    export interface ShareOptions {
        title?: string;
        message?: string;
        url?: string;
        urls?: string[];
        type?: string;
        subject?: string;
        email?: string;
        recipient?: string;
        excludedActivityTypes?: string[];
        failOnCancel?: boolean;
        showAppsToView?: boolean;
        filename?: string;
        saveToFiles?: boolean;
    }

    export interface ShareSingleOptions extends ShareOptions {
        social: string;
        forceDialog?: boolean;
    }

    export default class Share {
        static open(options: ShareOptions): Promise<{ success: boolean; message?: string }>;
        static shareSingle(options: ShareSingleOptions): Promise<{ success: boolean; message?: string }>;
        static isPackageInstalled(packageName: string): Promise<boolean>;
    }
}