const multer = require("multer");
const Path = require("path");
const fs = require("fs");
const multer1 = process.env.LOCAL_URL

exports.UploadFile = async (req, folder) => {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
            const path = `assets/${folder}`;
            console.log(path)
            fs.mkdirSync(path, { recursive: true })
            cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+ '-' + file.originalname.replace(/\s/g, ""));
    },
  });

  var upload = multer({ storage: storage }).any();
  return new Promise((resolve, reject) => {
    upload(req, (res = null), async function (err) {
      if (err) reject(err);
      if (req.files) {
        const length = req.files.length;
        if (length == 1) {
          resolve({
            body: req.body,
            file: {
              ...req.files[0],
              path: multer1 + req.files[0].path.replace("fnf_api/",""),
              length: 1,
            },
          });
        } else {
          resolve({
            body: req.body,
            file: req.files.map((image) => {
              let path = multer1 + image.path;
              return { ...image, path: path };
            }),
          });
        }
      }
    });
  });
};

exports.removefile = (file) => {
  if (!file) {
    console.log("no file");
    return;
  }
  const path = Path.join(
    __dirname,
    "../",
    file.replace(multer1, "")
  );
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    return "success";
  }
  return "doesn't exist";
};
