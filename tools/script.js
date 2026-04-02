function showFields() {

    let type = document.getElementById("type").value

    document.getElementById("textField").style.display = "none"
    document.getElementById("wifiField").style.display = "none"
    document.getElementById("contactField").style.display = "none"
    document.getElementById("fileField").style.display = "none"

    if (type === "text") document.getElementById("textField").style.display = "block"
    if (type === "wifi") document.getElementById("wifiField").style.display = "block"
    if (type === "contact") document.getElementById("contactField").style.display = "block"
    if (type === "file") document.getElementById("fileField").style.display = "block"

}

function generateQR() {

    let type = document.getElementById("type").value
    let data = ""

    if (type === "text") {

        data = document.getElementById("textInput").value

    }

    if (type === "wifi") {

        let ssid = document.getElementById("ssid").value
        let pass = document.getElementById("password").value

        data = `WIFI:T:WPA;S:${ssid};P:${pass};;`

    }

    if (type === "contact") {

        let name = document.getElementById("name").value
        let phone = document.getElementById("phone").value

        data = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
END:VCARD`

    }

    if (type === "file") {

        let file = document.getElementById("fileInput").files[0]

        if (!file) {
            alert("Upload file first")
            return
        }

        let fileURL = URL.createObjectURL(file)

        data = fileURL

    }

    let qr = document.getElementById("qrImage")

    qr.src = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" + encodeURIComponent(data)

}

function downloadQR() {

    let img = document.getElementById("qrImage").src

    let link = document.createElement("a")

    link.href = img
    link.download = "qrquick.png"

    link.click()

}

document.getElementById("qrUpload").addEventListener("change", function () {

    let file = this.files[0]
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

                document.getElementById("scanResult").innerText = "Decoded: " + code.data

            } else {

                document.getElementById("scanResult").innerText = "QR not detected"

            }

        }

        img.src = reader.result

    }

    reader.readAsDataURL(file)

})