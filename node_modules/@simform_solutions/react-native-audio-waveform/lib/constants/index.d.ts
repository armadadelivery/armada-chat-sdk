export declare enum DurationType {
    current = 0,
    max = 1
}
export declare enum NativeEvents {
    onDidFinishPlayingAudio = "onDidFinishPlayingAudio",
    onCurrentDuration = "onCurrentDuration",
    onCurrentExtractedWaveformData = "onCurrentExtractedWaveformData",
    onCurrentRecordingWaveformData = "onCurrentRecordingWaveformData"
}
export declare enum PermissionStatus {
    denied = "denied",
    undetermined = "undetermined",
    granted = "granted"
}
export declare enum FinishMode {
    loop = 0,
    pause = 1,
    stop = 2
}
export declare enum PlayerState {
    playing = "playing",
    paused = "paused",
    stopped = "stopped"
}
export declare enum RecorderState {
    recording = "recording",
    paused = "paused",
    stopped = "stopped"
}
export declare enum UpdateFrequency {
    high = 250,
    medium = 500,
    low = 1000
}
export declare const playbackSpeedThreshold = 2;
