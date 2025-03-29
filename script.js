const versions = ["NTSC-U1.0", "NTSC-U1.1", "NTSC-U1.2", "PAL", "NTSC-J"];

const offsetTable = [[0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000],
                     [0x0A9708, 0x000000, 0x0000B0, 0x000310, 0x000340, 0x0002C4],
                     [0x0B84D0, 0x000000, 0x0000B0, 0x000308, 0x000340, 0x0002C4],
                     [0x0BB558, 0x000000, 0x0000B0, 0x000310, 0x000340, 0x0002C4],
                     [0x1C8E10, 0x000000, 0x000370, 0x0005A0, 0x0005D0, 0x000A00]];

function computeOffset(opcode, address, ver1, ver2) {
    if([0x50, 0xD4, 0xD5, 0xD6, 0xC1].includes(opcode)) return 0;
    let offset;
    for(offset = 0; offset < offsetTable.length; offset++) {
        if(address - offsetTable[offset][ver1 + 1] < offsetTable[offset][0]) break;
    }
    offset--;
    return offsetTable[offset][ver2 + 1] - offsetTable[offset][ver1 + 1];
}

function translateCode(code, ver1, ver2) {
    if(!/^[a-fA-F0-9]{8}[a-fA-F0-9]{4}$/g.test(code)) return "Invalid code: " + code;
    const newop = parseInt(code.substring(0, 2), 16);
    let newcode = parseInt(code.substring(2, 8), 16);
    if(isNaN(newcode) || newcode === 0 || isNaN(newop)) return "Invalid code: " + code;
    newcode += computeOffset(newop, newcode, ver1, ver2);
    const part1 = newop.toString(16).padStart(2, "0");
    const part2 = newcode.toString(16).padStart(6, "0");
    const rest = code.substr(8);
    return (part1 + part2 + " " + rest).toUpperCase(); 
}

function translate() {
    const ver1 = versions.indexOf(document.getElementById("ver1").value);
    const ver2 = versions.indexOf(document.getElementById("ver2").value);
    const codes1 = document.getElementById("codes1").value.split("\n").filter(code => /[^\s]/g.test(code)).map(code => code.replace(/\s+/g, ""));
    const codes2 = [];
    for(const code of codes1) codes2.push(translateCode(code, ver1, ver2));
    document.getElementById("codes2").value = codes2.join("\n");
}

function initGui() {
    for(const sel of document.getElementsByTagName("select")) {
        for(const ver of versions) {
            const opt = document.createElement("option");
            opt.textContent = ver;
            opt.value = ver;
            sel.appendChild(opt);
        }
    }
    document.querySelector("input[type='button']").addEventListener("click", translate);
}

initGui();