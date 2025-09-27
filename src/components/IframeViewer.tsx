interface IframeViewerProps {
  src: string;
}

export default function IframeViewer({ src }: IframeViewerProps) {
  return (
    <iframe
      src={src}
      className="w-full h-full"
      title="PDF Viewer"
      frameBorder="0"
    />
  );
}
