export const iframeHTMLRenderer = {
    htmlBlock: {
      iframe(node: { attrs: Record<string, string>; childrenHTML: string }) {
        return [
          {
            type: 'openTag',
            tagName: 'iframe',
            outerNewLine: true,
            attributes: node.attrs,
          },
          { type: 'html', content: node.childrenHTML ?? '' },
          { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
        ];
      },
    },
};

export const convertVideoLinks = (html: string) => {
    let converted = html;
    const createIframe = (src: string) =>
      `<iframe src="${src}" frameborder="0" allowfullscreen style="display:block;width:100%;max-width:100%;aspect-ratio:16 / 9;height:auto;"></iframe>`;
  
    converted = converted.replace(
      /https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/g,
      (_, id) => createIframe(`https://www.youtube.com/embed/${id}`),
    );
  
    converted = converted.replace(
      /https?:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
      (_, id) => createIframe(`https://www.youtube.com/embed/${id}`),
    );
  
    return converted;
};

// test check PR open workflows + md generate test
  


  