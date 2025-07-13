import { AudioWaveform } from '../AudioWaveform';
export const useAudioRecorder = () => {
    const startRecording = (args) => AudioWaveform.startRecording(args);
    const stopRecording = () => AudioWaveform.stopRecording();
    const pauseRecording = () => AudioWaveform.pauseRecording();
    const resumeRecording = () => AudioWaveform.resumeRecording();
    const getDecibel = () => AudioWaveform.getDecibel();
    return {
        getDecibel,
        pauseRecording,
        resumeRecording,
        startRecording,
        stopRecording,
    };
};
//# sourceMappingURL=useAudioRecorder.js.map