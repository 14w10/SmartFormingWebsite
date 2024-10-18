const readURL = (file: File) => {
  return new Promise<string>((res, rej) => {
    const reader = new FileReader();
    reader.onload = e => e?.target && res(e.target.result as string);
    reader.onerror = e => rej(e);
    reader.readAsDataURL(file);
  });
};

export const getImageDimensions = async (file: File) => {
  const imageUrl = await readURL(file);

  return new Promise<{ width: number; height: number }>(function (resolved) {
    const image = new Image();
    image.onload = () => resolved({ width: image.width, height: image.height });
    image.src = imageUrl;
  });
};
