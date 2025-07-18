//@ts-nocheck

import { useEffect, useState, type ReactNode, type Ref } from "react";
import { createPortal } from "react-dom";

const IframeRenderer = ({ children, links }: {
  children: ReactNode, links?: {
    rel?: string,
    href?: string,
    tag?: 'link' | 'script',
    type?: string,
    src?: string
  }[]
}) => {

  const [ref, setRef] = useState<Ref<HTMLIFrameElement>>();
  const container = ref?.contentDocument?.body;

  const document = ref?.contentDocument;

  useEffect(() => {
    if (document) {
      const head = document.head
      if (links) {
        for (const link of links) {
          if (link.tag === 'link') {
            const linkEl = document.createElement('link');
            linkEl.rel = link.rel;
            linkEl.href = link.href;
            linkEl.type = link.type || 'text/css'; // Default to text/css if type is not provided
            linkEl.crossOrigin = 'anonymous'; // Optional: Set CORS policy if needed
            head.appendChild(linkEl);
          } else if (link.tag === 'script') {
            const scriptEl = document.createElement('script');
            scriptEl.src = link.src;
            scriptEl.type = link.type;
            scriptEl.async = true; // Optional: Load scripts asynchronously
            head.appendChild(scriptEl);
          }
        }
      }
    }
  }, [document, links])

  return (
    <iframe style={{
      width: '100%',
      height: '100%',

    }} ref={setRef} title="Iframe" >{
        container && createPortal(children, container)
      }
    </iframe>
  )
}

export default IframeRenderer