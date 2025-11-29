"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Monitor, Smartphone, Globe, Cpu } from "lucide-react"

export default function BrowserInspectorPage() {
    const [capabilities, setCapabilities] = React.useState<any>({})

    React.useEffect(() => {
        // Detect browser capabilities
        const caps: any = {
            // Browser Info
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,

            // Screen Info
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            availWidth: window.screen.availWidth,
            availHeight: window.screen.availHeight,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio,

            // Window Info
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            outerWidth: window.outerWidth,
            outerHeight: window.outerHeight,

            // Storage
            localStorage: typeof localStorage !== 'undefined',
            sessionStorage: typeof sessionStorage !== 'undefined',
            indexedDB: typeof indexedDB !== 'undefined',

            // APIs
            geolocation: 'geolocation' in navigator,
            notifications: 'Notification' in window,
            serviceWorker: 'serviceWorker' in navigator,
            webWorker: typeof Worker !== 'undefined',
            webSocket: 'WebSocket' in window,
            webRTC: 'RTCPeerConnection' in window || 'webkitRTCPeerConnection' in window,
            webGL: (() => {
                try {
                    const canvas = document.createElement('canvas')
                    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
                } catch (e) {
                    return false
                }
            })(),

            // Media
            mediaDevices: 'mediaDevices' in navigator,
            getUserMedia: 'getUserMedia' in navigator || 'webkitGetUserMedia' in navigator,

            // Other
            touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            pointerEvents: 'PointerEvent' in window,
            batteryAPI: 'getBattery' in navigator,
            vibration: 'vibrate' in navigator,
            bluetooth: 'bluetooth' in navigator,
            usb: 'usb' in navigator,
        }

        setCapabilities(caps)
    }, [])

    const CapabilityRow = ({ label, value }: { label: string; value: boolean | string | number }) => {
        const isBoolean = typeof value === 'boolean'
        return (
            <div className="flex items-center justify-between py-2 border-b last:border-0">
                <span className="text-sm font-medium">{label}</span>
                {isBoolean ? (
                    value ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                    )
                ) : (
                    <span className="text-sm text-muted-foreground font-mono">{value}</span>
                )}
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Browser Inspector</h2>
                <p className="text-muted-foreground">
                    Inspect browser capabilities and device information.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Globe className="mr-2 h-5 w-5" />
                            Browser Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-0">
                        <CapabilityRow label="User Agent" value={capabilities.userAgent || 'N/A'} />
                        <CapabilityRow label="Platform" value={capabilities.platform || 'N/A'} />
                        <CapabilityRow label="Language" value={capabilities.language || 'N/A'} />
                        <CapabilityRow label="Cookies Enabled" value={capabilities.cookieEnabled} />
                        <CapabilityRow label="Online" value={capabilities.onLine} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Monitor className="mr-2 h-5 w-5" />
                            Screen & Display
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-0">
                        <CapabilityRow label="Screen Resolution" value={`${capabilities.screenWidth}x${capabilities.screenHeight}`} />
                        <CapabilityRow label="Available Space" value={`${capabilities.availWidth}x${capabilities.availHeight}`} />
                        <CapabilityRow label="Window Size" value={`${capabilities.innerWidth}x${capabilities.innerHeight}`} />
                        <CapabilityRow label="Color Depth" value={`${capabilities.colorDepth} bits`} />
                        <CapabilityRow label="Device Pixel Ratio" value={capabilities.devicePixelRatio} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Cpu className="mr-2 h-5 w-5" />
                            Storage APIs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-0">
                        <CapabilityRow label="Local Storage" value={capabilities.localStorage} />
                        <CapabilityRow label="Session Storage" value={capabilities.sessionStorage} />
                        <CapabilityRow label="IndexedDB" value={capabilities.indexedDB} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Smartphone className="mr-2 h-5 w-5" />
                            Device Features
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-0">
                        <CapabilityRow label="Touch Support" value={capabilities.touchSupport} />
                        <CapabilityRow label="Pointer Events" value={capabilities.pointerEvents} />
                        <CapabilityRow label="Vibration API" value={capabilities.vibration} />
                        <CapabilityRow label="Battery API" value={capabilities.batteryAPI} />
                        <CapabilityRow label="Bluetooth" value={capabilities.bluetooth} />
                        <CapabilityRow label="USB" value={capabilities.usb} />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Web APIs & Technologies</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-x-8">
                        <div className="space-y-0">
                            <CapabilityRow label="Geolocation" value={capabilities.geolocation} />
                            <CapabilityRow label="Notifications" value={capabilities.notifications} />
                            <CapabilityRow label="Service Worker" value={capabilities.serviceWorker} />
                        </div>
                        <div className="space-y-0">
                            <CapabilityRow label="Web Worker" value={capabilities.webWorker} />
                            <CapabilityRow label="WebSocket" value={capabilities.webSocket} />
                            <CapabilityRow label="WebRTC" value={capabilities.webRTC} />
                        </div>
                        <div className="space-y-0">
                            <CapabilityRow label="WebGL" value={capabilities.webGL} />
                            <CapabilityRow label="Media Devices" value={capabilities.mediaDevices} />
                            <CapabilityRow label="getUserMedia" value={capabilities.getUserMedia} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
