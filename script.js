let versionMap = { "NTSC-U1.0": 0, "NTSC-U1.1": 1, "NTSC-U1.2": 2, "PAL": 3, "NTSC-J": 4 }

let offsetTable = [[0x000000, 0x000, 0x000, 0x000, 0x000, 0x000],
                   [0x0A9708, 0x000, 0x0B0, 0x310, 0x340, 0x2C4],
                   [0x0B84D0, 0x000, 0x0B0, 0x308, 0x340, 0x2C4],
                   [0x0BB558, 0x000, 0x0B0, 0x310, 0x340, 0x2C4],
                   [0x1C8E10, 0x000, 0x370, 0x5A0, 0x5D0, 0xA00]];

function computeOffset(opcode, address, version1, version2)
{
 if(opcode == 0x50 || opcode == 0xD4 || opcode == 0xD5 || opcode == 0xD6 || opcode == 0xC1)
 {
  return 0;
 }
 let offset;
 for(offset = 0; offsetTable[offset] != null; ++offset)
 {
  if(address - offsetTable[offset][version1 + 1] < offsetTable[offset][0])
  {
   break;
  }
 }
 --offset;
 return offsetTable[offset][version2 + 1] - offsetTable[offset][version1 + 1];
}

function translateCode(code, version1, version2)
{
 let matches = code.match(/[a-fA-F0-9]{8}[a-fA-F0-9]{4}/g);
 if(matches === null || matches.length !== 1 || matches[0] !== code)
 {
  return "Invalid code: " + code;
 }
 let newop = parseInt(code.substring(0, 2), 16);
 let newcode = parseInt(code.substring(2, 8), 16);
 let rest = code.substr(8);
 if(!isNaN(newcode) && newcode !== 0 && !isNaN(newop))
 {
  newcode += computeOffset(newop, newcode, version1, version2);
  let part1 = newop.toString(16).padStart(2, "0");
  let part2 = newcode.toString(16).padStart(6, "0");
  return part1.toUpperCase() + part2.toUpperCase() + " " + rest.toUpperCase();
 }
 return "Invalid code: " + code;
}

function translateCodes()
{
 let version1 = document.getElementById("version1").value;
 let version2 = document.getElementById("version2").value;
 let version1Codes = document.getElementById("version1Codes").value.split("\n").filter(code => { return code.search(/[^\s]/g) !== -1; }).map(code => { return code.replace(/\s+/g, ""); });
 let version2Codes = [];
 for(let i = 0; i < version1Codes.length; i++)
 {
  version2Codes.push(translateCode(version1Codes[i], versionMap[version1], versionMap[version2]));
 }
 document.getElementById("version2Codes").value = version2Codes.join("\n");
}