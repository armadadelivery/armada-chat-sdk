export var DurationType;
(function (DurationType) {
    DurationType[DurationType["current"] = 0] = "current";
    DurationType[DurationType["max"] = 1] = "max";
})(DurationType || (DurationType = {}));
export var NativeEvents;
(function (NativeEvents) {
    NativeEvents["onDidFinishPlayingAudio"] = "onDidFinishPlayingAudio";
    NativeEvents["onCurrentDuration"] = "onCurrentDuration";
    NativeEvents["onCurrentExtractedWaveformData"] = "onCurrentExtractedWaveformData";
    NativeEvents["onCurrentRecordingWaveformData"] = "onCurrentRecordingWaveformData";
})(NativeEvents || (NativeEvents = {}));
export var PermissionStatus;
(function (PermissionStatus) {
    PermissionStatus["denied"] = "denied";
    PermissionStatus["undetermined"] = "undetermined";
    PermissionStatus["granted"] = "granted";
})(PermissionStatus || (PermissionStatus = {}));
export var FinishMode;
(function (FinishMode) {
    FinishMode[FinishMode["loop"] = 0] = "loop";
    FinishMode[FinishMode["pause"] = 1] = "pause";
    FinishMode[FinishMode["stop"] = 2] = "stop";
})(FinishMode || (FinishMode = {}));
export var PlayerState;
(function (PlayerState) {
    PlayerState["playing"] = "playing";
    PlayerState["paused"] = "paused";
    PlayerState["stopped"] = "stopped";
})(PlayerState || (PlayerState = {}));
export var RecorderState;
(function (RecorderState) {
    RecorderState["recording"] = "recording";
    RecorderState["paused"] = "paused";
    RecorderState["stopped"] = "stopped";
})(RecorderState || (RecorderState = {}));
//Note: If you are making change here, please make sure to make change in iOS and Android side as well other wise there will be mismatch in value
//Use same values in iOS and Android side as well
export var UpdateFrequency;
(function (UpdateFrequency) {
    UpdateFrequency[UpdateFrequency["high"] = 250] = "high";
    UpdateFrequency[UpdateFrequency["medium"] = 500] = "medium";
    UpdateFrequency[UpdateFrequency["low"] = 1000] = "low";
})(UpdateFrequency || (UpdateFrequency = {}));
export const playbackSpeedThreshold = 2.0;
//# sourceMappingURL=index.js.map