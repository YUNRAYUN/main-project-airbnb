const { Storage } = require("@google-cloud/storage");
const sharp = require("sharp"); // 사진을 자르기 위해서 sharp 라이브러리를 사용

exports.MyThumnailTrigger = async (image) => {
  // storage 초기화/ 정보
  const storage = new Storage().bucket(image.bucket);

  const imageSize = [
    { width: 320, size: "s" },
    { width: 640, size: "m" },
    { width: 1280, size: "l" },
  ];
  const imageName = image.name; // 파일의 이름 ex> image.jpg

  // 사진이 반복적으로 생성되는 것을 막아줌 -> 반복문 사용시 thumb 라는 폴더 위치도 반복되기 때문에
  if (imageName.includes("thumb/s/")) return;
  if (imageName.includes("thumb/m/")) return;
  if (imageName.includes("thumb/l/")) return;

  // Promise.all안에 배열이 들어가있고 -> 끝나면 한번에 전송
  await Promise.all(
    imageSize.map((el) => {
      return new Promise((resolve, reject) => {
        storage // 버켓의 저장소
          .file(imageName) // 파일의 이름
          .createReadStream() // 읽어서 stream으로 만듬
          .pipe(sharp().resize(el.width)) // 사진의 너비를  320, 640,1280 로 바꿈
          .pipe(
            storage.file(`thumb/${el.size}/${imageName}`).createWriteStream()
          ) // thumb폴더안 s,m,l폴더에 image.jpg라는 이름으로 stream을 저장
          .on("finish", () => resolve())
          .on("error", () => reject());
      });
    })
  );
};
