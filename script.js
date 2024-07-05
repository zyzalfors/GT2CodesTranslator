const versions = ["NTSC-U1.0", "NTSC-U1.1", "NTSC-U1.2", "PAL", "NTSC-J"];

const offsetTable = [[0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x000000],
                     [0x0A9708, 0x000000, 0x0000B0, 0x000310, 0x000340, 0x0002C4],
                     [0x0B84D0, 0x000000, 0x0000B0, 0x000308, 0x000340, 0x0002C4],
                     [0x0BB558, 0x000000, 0x0000B0, 0x000310, 0x000340, 0x0002C4],
                     [0x1C8E10, 0x000000, 0x000370, 0x0005A0, 0x0005D0, 0x000A00]];

function computeOffset(opcode, address, version1, version2) {
 if([0x50, 0xD4, 0xD5, 0xD6, 0xC1].includes(opcode)) return 0;
 let offset;
 for(offset = 0; offset < offsetTable.length; offset++) {
  if(address - offsetTable[offset][version1 + 1] < offsetTable[offset][0]) break;
 }
 offset--;
 return offsetTable[offset][version2 + 1] - offsetTable[offset][version1 + 1];
}

function translateCode(code, version1, version2) {
 if(!/^[a-fA-F0-9]{8}[a-fA-F0-9]{4}$/g.test(code)) return "Invalid code: " + code;
 const newop = parseInt(code.substring(0, 2), 16);
 let newcode = parseInt(code.substring(2, 8), 16);
 if(isNaN(newcode) || newcode === 0 || isNaN(newop)) return "Invalid code: " + code;
 newcode += computeOffset(newop, newcode, version1, version2);
 const part1 = newop.toString(16).padStart(2, "0");
 const part2 = newcode.toString(16).padStart(6, "0");
 const rest = code.substr(8);
 return (part1 + part2 + " " + rest).toUpperCase(); 
}

function translateCodes() {
 const version1 = versions.indexOf(document.getElementById("version1").value);
 const version2 = versions.indexOf(document.getElementById("version2").value);
 const version1Codes = document.getElementById("version1Codes").value.split("\n").filter(code => code.search(/[^\s]/g) > -1).map(code => code.replace(/\s+/g, ""));
 let version2Codes = [];
 for(const code of version1Codes) version2Codes.push(translateCode(code, version1, version2));
 document.getElementById("version2Codes").value = version2Codes.join("\n");
}
