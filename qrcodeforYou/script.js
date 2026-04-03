function switchTool() {

    let type = document.getElementById("type").value

    document.getElementById("textBox").classList.add("hide")
    document.getElementById("wifiBox").classList.add("hide")
    document.getElementById("contactBox").classList.add("hide")
    document.getElementById("fileBox").classList.add("hide")
    document.getElementById("imageBox").classList.add("hide")

    if (type === "text") document.getElementById("textBox").classList.remove("hide")
    if (type === "wifi") document.getElementById("wifiBox").classList.remove("hide")
    if (type === "contact") document.getElementById("contactBox").classList.remove("hide")
    if (type === "file") document.getElementById("fileBox").classList.remove("hide")
    if (type === "image") document.getElementById("imageBox").classList.remove("hide")

}

async function generateQR() {

    let type = document.getElementById("type").value
    let data = ""

    if (type === "text") {

        data = document.getElementById("textInput").value

        createQR(data)

    }

    if (type === "wifi") {

        let s = document.getElementById("ssid").value
        let p = document.getElementById("password").value

        data = `WIFI:T:WPA;S:${s};P:${p};;`

        createQR(data)

    }

    if (type === "contact") {

        let n = document.getElementById("name").value
        let ph = document.getElementById("phone").value

        data = `BEGIN:VCARD
FN:${n}
TEL:${ph}
END:VCARD`

        createQR(data)

    }

    if (type === "file") {

        let file = document.getElementById("fileInput").files[0]

        if (!file) {

            alert("Select file first")
            return

        }

        uploadAndGenerateQR(file)

    }

    if (type === "image") {

        let file = document.getElementById("imageInput").files[0]

        if (!file) {

            alert("Select image first")
            return

        }

        uploadAndGenerateQR(file)

    }

}

function createQR(data) {

    document.getElementById("qrImage").src =
        "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" + encodeURIComponent(data)

}

async function uploadAndGenerateQR(file) {

    try {

        // get server
        let serverRes = await fetch("https://api.gofile.io/servers")
        let serverData = await serverRes.json()

        let server = serverData.data.servers[0].name

        // upload file
        let formData = new FormData()
        formData.append("file", file)

        let uploadRes = await fetch(`https://${server}.gofile.io/uploadFile`, {
            method: "POST",
            body: formData
        })

        let uploadData = await uploadRes.json()

        // NEW response format
        let link = uploadData.data.downloadPage

        createQR(link)

    } catch (err) {

        console.log(err)
        alert("Upload failed")

    }

}

function downloadQR() {

    let img = document.getElementById("qrImage").src

    let a = document.createElement("a")

    a.href = img
    a.download = "qrcode.png"

    a.click()

}

document.getElementById("scanInput").addEventListener("change", function () {

    let file = this.files[0]

    if (!file) return

    let reader = new FileReader()

    reader.onload = function () {

        let img = new Image()

        img.onload = function () {

            let canvas = document.createElement("canvas")
            let ctx = canvas.getContext("2d")

            canvas.width = img.width
            canvas.height = img.height

            ctx.drawImage(img, 0, 0)

            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

            let code = jsQR(imageData.data, canvas.width, canvas.height)

            if (code) {

                document.getElementById("result").innerText = "Result: " + code.data

            } else {

                document.getElementById("result").innerText = "QR not detected"

            }

        }

        img.src = reader.result

    }

    reader.readAsDataURL(file)

})