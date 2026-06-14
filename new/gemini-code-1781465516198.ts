import { useState, useRef } from 'react';

export const useAudioRecorder = () => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    chunks.current = [];
    mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
      setBlob(audioBlob);
    };
  };

  return { startRecording, stopRecording, blob };
};