//------------------------------------------------------------------------------

"use strict";

//------------------------------------------------------------------------------

const
	AtomsFREE = ['free','skip','wide'],

	AtomsLVL0 = ['ftyp','mdat','meta','moov','uuid','free','skip','wide'],

	AtomsCheck = {
		'apch_6': [],
		'apcs_6': [],
		'avc1_6': ['avcC', 'colr'],
		'avcC_7': [],
		'clef_3': [],
		'co64_5': [],
		'colr_7': [],
		'ctts_5': [],
		'dinf_4': ['dref'],
		'dref_5': [],
		'edts_2': ['elst'],
		'elst_3': [],
		'esds_7': [],
		'enof_3': [],
		'ftyp_0': [],
		'gmhd_4': ['tmcd'],
		'hdlr_1': [],
		'hdlr_2': [],
		'hdlr_3': ['tmcd', 'meta'],
		'hdlr_4': [],
		'hvc1_6': ['hvcC', 'pasp'],
		'hvcC_7': [],
		'iods_1': [],
		'mdat_0': [],
		'mdhd_3': [],
		'mdia_2': ['mdhd', 'hdlr', 'minf'],
		'meta_0': ['hdlr'],
		'meta_1': ['hdlr'],
		'meta_2': ['hdlr'],
		'meta_4': [],
		'minf_3': ['vmhd', 'dinf', 'stbl', 'smhd', 'hdlr', 'gmhd'],
		'moov_0': ['udta', 'mvhd', 'trak', 'iods', 'meta'],
		'mp4a_6': ['esds'],
		'mp4v_6': ['esds'],
		'mvhd_1': [],
		'nmhd_4': [],
		'pasp_7': [],
		'prof_3': [],
		'sdtp_5': [],
		'smhd_4': [],
		'sowt_6': [],
		'stbl_4': ['stsd', 'stts', 'stss', 'ctts', 'stsc', 'stsz', 'co64', 'sdtp', 'stco'],
		'stco_5': [],
		'stsc_5': [],
		'stsd_5': ['avc1', 'mp4a', 'tmcd'],
		'stss_5': [],
		'stsz_5': [],
		'stts_5': [],
		'tapt_2': ['clef','prof','enof'],
		'tkhd_2': [],
		'tmcd_3': [],
		'tmcd_4': [],
		'tmcd_5': [],
		'tmcd_6': [],
		'trak_1': ['tkhd', 'edts', 'mdia', 'tref'],
		'tref_2': ['tmcd'],
		'twos_6': [],
		'udta_1': ['meta'],
		'vmhd_4': [],
		'uuid_0': [],
		'uuid_1': [],
		'uuid_2': [],
		'uuid_3': [],
		'uuid_4': [],
		'uuid_5': []
	},

	Atoms = [
		'apch',
		'apcs',
		'avc1',
		'avcC',
		//'clef',
		//'cmov',
		//'cmvd',
		'co64',
		'ctts',
		'dinf',
		'dref',
		'edts',
		'elst',
		//'enof',
		'esds',
		'free',
		'ftyp',
		'gmhd',
		'hdlr',
		'hvc1',
		'hvcC',
		//'iods',
		//'junk',
		'mdat',
		'mdhd',
		'mdia',
		'meta',
		'minf',
		'moov',
		'mp4a',
		'mp4v',
		'mvhd',
		'nmhd',
		'pasp',
		//'pnot',
		//'prof',
		'sdtp',
		'skip',
		'smhd',
		'sowt',
		'stbl',
		'stco',
		'stsc',
		'stsd',
		'stss',
		'stsz',
		'stts',
		'tapt',
		'tkhd',
		'tmcd',
		'trak',
		'tref',
		'twos',
		'uuid',
		'udta',
		'vmhd',
		'wide'],

	CHUNK_SIZE = 1024 * 1024,
	ATOM_BUF_SIZE = 1024,

	TPL_HEADER_NAMES = [
		'apch',
		'apcs',
		'avc1',
		'avcC',
		'co64',
		'ctts',
		'dinf',
		'dref',
		'edts',
		'elst',
		'esds',
		'hdlr',
		'hvc1',
		'mdhd',
		'mdia',
		'minf',
		'moov',
		'mp4a',
		'mp4v',
		'mvhd',
		'nmhd',
		'sdtp',
		'smhd',
		'sowt',
		'stbl',
		'stco',
		'stsc',
		'stsd',
		'stss',
		'stsz',
		'stts',
		'tkhd',
		'tmcd',
		'trak',
		'tref',
		'twos',
		'vmhd'
	],


	ATM_NONE_0 = -1,
	ATM_FTYP_0 = 0,
	ATM_UUID_0 = 1,
	ATM_MOOV_0 = 2,
	ATM_MVHD_0 = 3,
	ATM_TRAK_1 = 4,
	ATM_TKHD_1 = 5,
	ATM_EDTS_1 = 6,
	ATM_MDIA_1 = 7,
	ATM_MDHD_1 = 8,
	ATM_HDLR_1 = 9,
	ATM_MINF_1 = 10,
	ATM_VMHD_1 = 11,
	ATM_DINF_1 = 12,
	ATM_DREF_1 = 13,
	ATM_STBL_1 = 14,
	ATM_STSD_1 = 15,
	ATM_CODV_1 = 16,
	ATM_STTS_1 = 17,
	ATM_STSC_1 = 18,
	ATM_STSZ_1 = 19,
	ATM_STCO_1 = 20,
	ATM_STSS_1 = 21,
	ATM_TRAK_2 = 22,
	ATM_TKHD_2 = 23,
	ATM_EDTS_2 = 24,
	ATM_MDIA_2 = 25,
	ATM_MDHD_2 = 26,
	ATM_HDLR_2 = 27,
	ATM_MINF_2 = 28,
	ATM_SMHD_2 = 29,
	ATM_DINF_2 = 30,
	ATM_DREF_2 = 31,
	ATM_STBL_2 = 32,
	ATM_STSD_2 = 33,
	ATM_CODA_2 = 34,
	ATM_STTS_2 = 35,
	ATM_STSC_2 = 36,
	ATM_STSZ_2 = 37,
	ATM_STCO_2 = 38,
	ATM_FREE_0 = 39,
	ATM_MDAT_0 = 40,

	TPL_FILE = {
		[ATM_FTYP_0]: { name:'ftyp', lvl:0, par:ATM_NONE_0, copy:1 },
		[ATM_UUID_0]: { name:'uuid', lvl:0, par:ATM_NONE_0, copy:1 },
		[ATM_MOOV_0]: { name:'moov', lvl:0, par:ATM_NONE_0, copy:0 },
		[ATM_MVHD_0]: { name:'mvhd', lvl:1, par:ATM_MOOV_0, copy:1 },

		[ATM_TRAK_1]: { name:'trak', lvl:1, par:ATM_MOOV_0, copy:0 },
		[ATM_TKHD_1]: { name:'tkhd', lvl:2, par:ATM_TRAK_1, copy:1 },
		[ATM_EDTS_1]: { name:'edts', lvl:2, par:ATM_TRAK_1, copy:1 },
		[ATM_MDIA_1]: { name:'mdia', lvl:2, par:ATM_TRAK_1, copy:0 },
		[ATM_MDHD_1]: { name:'mdhd', lvl:3, par:ATM_MDIA_1, copy:1 },
		[ATM_HDLR_1]: { name:'hdlr', lvl:3, par:ATM_MDIA_1, copy:1 },
		[ATM_MINF_1]: { name:'minf', lvl:3, par:ATM_MDIA_1, copy:0 },
		[ATM_VMHD_1]: { name:'vmhd', lvl:4, par:ATM_MINF_1, copy:1 },
		[ATM_DINF_1]: { name:'dinf', lvl:4, par:ATM_MINF_1, copy:0 },
		[ATM_DREF_1]: { name:'dref', lvl:5, par:ATM_DINF_1, copy:1 },
		[ATM_STBL_1]: { name:'stbl', lvl:4, par:ATM_MINF_1, copy:0 },
		[ATM_STSD_1]: { name:'stsd', lvl:5, par:ATM_STBL_1, copy:1 },
		[ATM_CODV_1]: { name:'codv', lvl:6, par:ATM_STSD_1, copy:1 },
		[ATM_STTS_1]: { name:'stts', lvl:5, par:ATM_STBL_1, copy:1 },
		[ATM_STSC_1]: { name:'stsc', lvl:5, par:ATM_STBL_1, copy:1 },
		[ATM_STSZ_1]: { name:'stsz', lvl:5, par:ATM_STBL_1, copy:1 },
		[ATM_STCO_1]: { name:'stco', lvl:5, par:ATM_STBL_1, copy:1 },
		[ATM_STSS_1]: { name:'stss', lvl:5, par:ATM_STBL_1, copy:1 },

		[ATM_TRAK_2]: { name:'trak', lvl:1, par:ATM_MOOV_0, copy:0 },
		[ATM_TKHD_2]: { name:'tkhd', lvl:2, par:ATM_TRAK_2, copy:1 },
		[ATM_EDTS_2]: { name:'edts', lvl:2, par:ATM_TRAK_2, copy:1 },
		[ATM_MDIA_2]: { name:'mdia', lvl:2, par:ATM_TRAK_2, copy:0 },
		[ATM_MDHD_2]: { name:'mdhd', lvl:3, par:ATM_MDIA_2, copy:1 },
		[ATM_HDLR_2]: { name:'hdlr', lvl:3, par:ATM_MDIA_2, copy:1 },
		[ATM_MINF_2]: { name:'minf', lvl:3, par:ATM_MDIA_2, copy:0 },
		[ATM_SMHD_2]: { name:'smhd', lvl:4, par:ATM_MINF_2, copy:1 },
		[ATM_DINF_2]: { name:'dinf', lvl:4, par:ATM_MINF_2, copy:0 },
		[ATM_DREF_2]: { name:'dref', lvl:5, par:ATM_DINF_2, copy:1 },
		[ATM_STBL_2]: { name:'stbl', lvl:4, par:ATM_MINF_2, copy:0 },
		[ATM_STSD_2]: { name:'stsd', lvl:5, par:ATM_STBL_2, copy:1 },
		[ATM_CODA_2]: { name:'coda', lvl:6, par:ATM_STSD_2, copy:1 },
		[ATM_STTS_2]: { name:'stts', lvl:5, par:ATM_STBL_2, copy:1 },
		[ATM_STSC_2]: { name:'stsc', lvl:5, par:ATM_STBL_2, copy:1 },
		[ATM_STSZ_2]: { name:'stsz', lvl:5, par:ATM_STBL_2, copy:1 },
		[ATM_STCO_2]: { name:'stco', lvl:5, par:ATM_STBL_2, copy:1 },

		[ATM_FREE_0]: { name:'free', lvl:0, par:ATM_NONE_0, copy:1 },
		[ATM_MDAT_0]: { name:'mdat', lvl:0, par:ATM_NONE_0, copy:1 }
	},

	TPL_MATRIX = new Uint8Array([0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,64,0,0,0]),

	TPL_TIME = Math.round(( new Date().getTime() + (new Date(Date.UTC(1970,1,1)).getTime() - new Date(1904,1,1).getTime())) / 1000),

	TPL_ACODEC = ['mp4a','twos','sowt'],
	TPL_ACODEC_SUB = ['esds'],
	TPL_VCODEC = ['avc1','hvc1','apch','apcs','mp4v'],
	TPL_VCODEC_SUB = ['avcC','hvcC','pasp','colr','esds'],
	TPL_TCODEC = ['tmcd'],

	PATTERN_BYTE_LEN = 8;

//------------------------------------------------------------------------------

class Atom {
	constructor(){
	}
}

//------------------------------------------------------------------------------

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

//------------------------------------------------------------------------------

function abi_median(arr){
	const mid = Math.floor(arr.length / 2),
		nums = [...arr].sort((a, b) => a - b);
	return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

function abi_bytes2int(arr){
	let val = 0;
	for( let i = 0; i < arr.length; i++ ){
		val = (val * 256) + arr[i];
	}
	return val;
}

function bitsSliceU16(val, pos, len){
    val = val >> ( 16 - ( pos + len ));
	return val & ~(0xFFFF << len)
}

//------------------------------------------------------------------------------

function abi_concat(arrays) {
	let totalLength = arrays.reduce((acc, value) => acc + value.length, 0);

	if (!arrays.length) return null;

	let result = new Uint8Array(totalLength);

	// for each array - copy it over result
	// next array is copied right after the previous one
	let length = 0;
	for(let array of arrays) {
		result.set(array, length);
		length += array.length;
	}

	return result;
}

function abi_range(val, shift){
	let
	res = [];
	val = val || 0;
	shift = shift || 0;
	for( let i = val - shift; i <= val + shift; i++ ){
		res.push(i);
	}
	return res;
}

//------------------------------------------------------------------------------

function abi_sec2hms(s){
	s = parseInt(s, 10);
	let
	hh = Math.floor(s / 3600),
	mm = Math.floor(s % 3600 / 60),
	ss = Math.floor(s % 3600 % 60);

	if( hh < 10 ) hh = '0' + hh;
	if( mm < 10 ) mm = '0' + mm;
	if( ss < 10 ) ss = '0' + ss;
    return hh + ':' + mm + ':' + ss;
}

//------------------------------------------------------------------------------
//--- NUMBER PROTOTYPES
//------------------------------------------------------------------------------

Number.prototype.isRound = function(div){
	return ( Math.floor(this / div) * div == this );
}


Number.prototype.inRange = function(val, shift){
	let
	div = this / val;
	return ( div < 1 + shift && div > 1 - shift );
}

//------------------------------------------------------------------------------
//--- STRING PROTOTYPES
//------------------------------------------------------------------------------

String.prototype.indexOfAll = function(text){
	let
	pos = 0,
	offs = 0,
	res = [];

	while( 1 ){
		pos = this.indexOf(text, offs);
		if( pos > -1 ){
			res.push(pos);
			offs = pos + text.length;
		} else {
			break;
		}
	}
	return res;
}

//------------------------------------------------------------------------------
//--- ARRAY PROTOTYPES
//------------------------------------------------------------------------------

Array.prototype.indexOfArray = function(Obj, Offset){
	Offset = Offset || 0;
	for( let i = Offset; i < 1 + (this.length - Obj.length); i++ ){
		let j = 0;
		for( ; j < Obj.length; j++ ){
			if( this[i + j] !== Obj[j] ) break;
		}
		if( j == Obj.length ) return i;
	}
	return -1;
}

Array.prototype.equals = function(arr){
	return ( arr.length === this.length && this.every(function(v, i){ return v === arr[i]}));
}

Array.prototype.median = function(){
	let
	mid = Math.floor(this.length / 2),
	nums = [...this].sort((a, b) => a - b);
	return this.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

//------------------------------------------------------------------------------
//--- UINT8 PROTOTYPES
//------------------------------------------------------------------------------

Uint8Array.prototype.checkSetUint32 = function(pos, val, shift, func){
	pos = pos || 0;
	let
	num = this.getUint32(pos),
	div = num / val;

	if( !func || ( func && !func(num))){
		if( div < 1 - shift || div > 1 + shift ){
			this.setUint32(val, pos);
		}
	}
}

Uint8Array.prototype.checkSetUint64 = function(pos, val, shift, func){
	pos = pos || 0;
	let
	num = this.getUint64(pos),
	div = num / val;

	if( !func || ( func && !func(num))){
		if( div < 1 - shift || div > 1 + shift ){
			this.setUint64(val, pos);
		}
	}
}

Uint8Array.prototype.concat = function(arr){
	let res = new Uint8Array(this.length + arr.length);
	res.set(this);
	res.set(arr, this.length);
	return res;
}

Uint8Array.prototype.setString = function(value, pos){
	pos = pos || 0;
	for( let i = 0; i < value.length; i++ ){
		this[i + pos] = value.charCodeAt(i);
	}
}

Uint8Array.prototype.setName = function(value, pos){
	pos = pos || 4;
	if( value.length == 4 ){
		this.setString(value, pos);
	}
}

Uint8Array.prototype.setInt64 = function(value, pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    view.setBigInt64(pos, BigInt(value), false);
}

Uint8Array.prototype.setUint64 = function(value, pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    view.setBigUint64(pos, BigInt(value), false);
}

Uint8Array.prototype.setInt32 = function(value, pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    view.setInt32(pos, value, false);
}

Uint8Array.prototype.setUint32 = function(value, pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    view.setUint32(pos, value, false);
}

Uint8Array.prototype.setInt16 = function(value, pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    view.setInt16(pos, value, false);
}

Uint8Array.prototype.setUint16 = function(value, pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    view.setUint16(pos, value, false);
}

Uint8Array.prototype.setInt8 = function(value, pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    view.setInt8(pos, value, false);
}

Uint8Array.prototype.setUint8 = function(value, pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    view.setUint8(pos, value, false);
}

Uint8Array.prototype.setSize = function(value, pos){
	pos = pos || 0;
	this.setUint32(value, pos);
}

Uint8Array.prototype.setSizeUI = function(value, is64){
	is64 = is64 || 0;
	if( is64 ){
		this.setUint32(1, 0);
		this.setUint64(value, 8);
	} else {
		this.setUint32(value, 0);
	}
}

Uint8Array.prototype.setArray = function(value, pos){
	pos = pos || 0;
	this.set(value, pos);
}

Uint8Array.prototype.getUint8 = function(pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    return view.getUint8(pos, false);
}

Uint8Array.prototype.getInt8 = function(pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    return view.getInt8(pos, false);
}

Uint8Array.prototype.getUint16 = function(pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    return view.getUint16(pos, false);
}

Uint8Array.prototype.getInt16 = function(pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    return view.getInt16(pos, false);
}

Uint8Array.prototype.getUint32 = function(pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    return view.getUint32(pos, false);
}

Uint8Array.prototype.getInt32 = function(pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    return view.getInt32(pos, false);
}

Uint8Array.prototype.getUint64 = function(pos){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    return Number(view.getBigUint64(pos, false));
}

Uint8Array.prototype.getInt64 = function(Start){
	pos = pos || 0;
	let view = new DataView(this.buffer);
    return Number(view.getBigInt64(pos, false));
}

Uint8Array.prototype.getDate = function(Start){
	let
	sec = Math.abs((new Date(Date.UTC(1970,1,1)).getTime() - new Date(1904,1,1).getTime()) / 1000);
	return new Date((this.getUint32(Start) - sec)*1000);
}

Uint8Array.prototype.getFloat32Fix = function(Start){
	let
    a1 = abi_bytes2int(Array.from(this.subarray(Start, Start + 2))),
    a2 = abi_bytes2int(Array.from(this.subarray(Start + 2, Start + 4)));
	return a1;
}

Uint8Array.prototype.getString = function(Start, Len){
	let
	txt = new TextDecoder('ascii');
	return txt.decode(this.subarray(Start, Start + Len)).replace(/\W/g, '');
}

Uint8Array.prototype.isString = function(Start, Len){
	let
	arr = Array.from(this.subarray(Start, Len));
	for( let i=0; i<arr.len; i++ ){
		if( !((arr[i]>64 && arr[i]<91)||(arr[i]>96 && arr[i]<123))){
			return false;
		}
	}
	return true;
}
Uint8Array.prototype.getVersion = function(pos){
	pos = pos || 0;
	return this.getUint8(0);
}

Uint8Array.prototype.getHex = function(pos){
	pos = pos || 0;
	return Array.from(Array.from(this), function(byte){
		return ('0' + (byte & 0xFF).toString(16)).slice(-2);
	}).join(' ');
}

Uint8Array.prototype.getBytesStr = function(pos){
	pos = pos || 0;
	return Array.from(Array.from(this), function(byte){
		return String(byte).padStart(3, '0');;
	}).join(' ');
}

Uint8Array.prototype.indexOfPattern = function(pat, pos){
	pos = pos || 0;
	let
	found = -1;

	for( let i = pos; i <= this.length - pat.length; i++ ){
		found = i;
		for( let j = 0; j < pat.length; j++ ){
			if( pat[j] > -1 ){
				if( pat[j] != this[i + j] ){
					found = -1;
					break;
				}
			}
		}
		if( found > -1 ) return found;
	}
	return -1;
}

Uint8Array.prototype.getBinString = function(){
	return this.reduce(function(str, byte){ return str + byte.toString(2).padStart(8, '0')}, '');
}


//------------------------------------------------------------------------------
//--- MAIN CLASS
//------------------------------------------------------------------------------

class abi_mediaBox {
	constructor(options, funcScan){
		this.options = options || {};
		this.funcScan = funcScan;
	}

    //--------------------------------------------------------------------------

	scanFile = function(file, funcDone){
		let
		__SELF = this;

		__SELF.repair = false;
		__SELF.funcDone = funcDone || false;
		__SELF.file = file;
		__SELF.__DATA = {ATOMS:[],HEADER:{},STRUCT:{},ERRORS:[],PARAMS:{}};

		__SELF.__scanFile();
	}

    //--------------------------------------------------------------------------

	__scanFile = function(){
		let
		__SELF = this,
		prevDATA = new Uint8Array();

		__SELF.__DATA.fileSize = __SELF.file.size;
		__SELF.__DATA.fileName = __SELF.file.name;
		__SELF.__DATA.fileExt = __SELF.file.name.split('.').pop();

		__SELF.funcScan({
			owner: __SELF,
			action: 'filescan_start'
		});

		__SELF.__readFileChunks(0, __SELF.file.size, function(buf, initOFFS){
			let
			curDATA = new Uint8Array(buf),
			scanDATA = prevDATA.concat(curDATA.subarray(0, curDATA.length-8)),
			mdatATOM = __SELF.__findATOMS('mdat', 0),
			val = 0,
			byte = 0,
			text = 0,
			name = 0,
			found = 0,
			atoms = 0,
			fPOS = 0,
			fCUR = 0,
			fATM = 0,
			fOFFS = 0,
			fSIZE = 0,
			tDEC = new TextDecoder('ascii'),
			scanTEXT = tDEC.decode(scanDATA);

			initOFFS -= prevDATA.length;

			return new Promise(function(resolve){
				Atoms.forEach(function(name){
					scanTEXT.indexOfAll(name).forEach(function(fPOS){
						fSIZE = scanDATA.getUint32(fPOS - 4);
						fOFFS = ( fSIZE == 1 ) ? 16 : 8;
						if( fSIZE == 1 ){
							fSIZE = scanDATA.getUint64(fPOS + 4);
						}
						if( fSIZE < 8 ){
							fSIZE = 8;
						}
						if( fSIZE < __SELF.__DATA.fileSize || name == 'mdat' ){
							atoms = __SELF.__findATOMS(name);
							fATM = new Atom();
							fATM.name = name;
							fATM.pos = initOFFS + fPOS - 4;
							fATM.next = fSIZE + fATM.pos;
							fATM.last = ( fATM.next >= __SELF.__DATA.fileSize );
							fATM.size = fSIZE;
							fATM.id = atoms.length;
							fATM.data = new Uint8Array(ATOM_BUF_SIZE);
							fATM.data.set(scanDATA.subarray(fPOS + 4).subarray(0,ATOM_BUF_SIZE));
							fATM.data_offs = fOFFS;
							if( name == 'mdat' ){
								fATM.ratio = fSIZE / __SELF.__DATA.fileSize;
								__SELF.__DATA.PARAMS.RATIOSIZE_MDAT = fATM.ratio;
							}
							__SELF.__DATA.ATOMS.push(fATM);
						}
					});
				});
				prevDATA = curDATA.subarray(curDATA.length-8);
				resolve(1);
			});
		}, function(){
			__SELF.funcScan({
				owner: __SELF,
				action: 'filescan_end'
			});
			__SELF.__parseDATA();
		});
	}

    //--------------------------------------------------------------------------

	__findATOMS = function(name, id){
		let
		__SELF = this,
		atm = 0,
		res = [];

		if( !Array.isArray(name)){
			name = [name];
		}

    	for( let i = 0; i < __SELF.__DATA.ATOMS.length; i++ ){
			atm = __SELF.__DATA.ATOMS[i];
			if( name.indexOf(atm.name) > -1 ){
				if( id ){
					if( atm.id == id ){
						res.push(atm);
						break;
					}
				} else {
					res.push(atm);
				}
			}
    	}
		return res;
	}

    //--------------------------------------------------------------------------

	__findTrATOMS = function(name, id){
		let
		__SELF = this,
		atm = 0,
		arr = 0,
		res = [];

		id = id || 0;
		if( __SELF.__DATA.HEADER['TR_' + id] ){
			arr = __SELF.__DATA.HEADER['TR_' + id];
		} else {
			return [];
		}

		if( !Array.isArray(name)){
			name = [name];
		}

    	for( let i = 0; i < arr.length; i++ ){
			atm = arr[i];
			if( name.indexOf(atm.name) > -1 ){
				res.push(atm);
			}
    	}
		return res;
	}

    //--------------------------------------------------------------------------

	__emptyAtomNames = function(){
		let
		__SELF = this,
		res = AtomsFREE.map(function(a){ return a });

		for( let s in AtomsCheck ){
			//--- avc1_6
			let a = s.split('_');
			if( !AtomsCheck[s].length && res.indexOf(a[0]) < 0 ){
				res.push(a[0]);
			}
		}
		return res;
	}

    //--------------------------------------------------------------------------

	__getAtomChildrenNames = function(atom, level){
		let
		__SELF = this,
		names = [],
		func_scan = function(name, level){
			let res = [];
			level = level || 0;
			if( AtomsCheck[name+'_'+level]){
				res.push(name);
				AtomsCheck[name+'_'+level].forEach(function(a){
					res = res.concat(func_scan(a, level+1));
				});
			}
			return res;
		}
		level = level || 0;
		return func_scan(atom, level);
	}

    //--------------------------------------------------------------------------

	__readFile = function(pos, len, callback){
		let
		__SELF = this,
		r = new FileReader(),
		b = __SELF.file.slice(pos, Math.min(pos + len, __SELF.__DATA.fileSize));

		r.onload = function(e){
			if( e.target.error == null ){
				callback(new Uint8Array(e.target.result));
				return;
			}
		}
		r.readAsArrayBuffer(b);
	}

    //--------------------------------------------------------------------------

	__readFileSync = function(pos, len){
		let
		__SELF = this;

		return new Promise(function(resolve, reject){
			let
			r = new FileReader(),
			b = __SELF.file.slice(pos, Math.min(pos + len, __SELF.__DATA.fileSize));

			if( b.size < len ){
				reject();
			}

			r.onload = function(e){
				if( e.target.error == null ){
					resolve(new Uint8Array(e.target.result));
				} else {
					reject();
				}
			}
			r.readAsArrayBuffer(b);
		})
	}

    //--------------------------------------------------------------------------


	__readFileChunks = function(pos, len, callback, funcDone){
		let
		__SELF = this,
		startPos = pos,
		length = 0,
		endPos = Math.min(pos + len, __SELF.file.size),
		perc1 = 0,
		perc2 = 0,
		offs = 0,
		readEventHandler = function(evt){
			if(evt.target.error == null){
				length = evt.target.result.length || evt.target.result.byteLength;
				perc2 = Math.round((startPos + length - pos) / ((endPos - pos) / 100));
				if( perc2 > perc1 ){
					__SELF.funcScan({
						owner: __SELF,
						action: 'filescan',
						value: perc2
					});
					console.log('-- Scan file --');
					perc1 = perc2;
				}
				callback(evt.target.result, startPos, perc2).then(function(){
					startPos += length;
					if( startPos >= endPos ){
						funcDone();
					} else {
						chunkReaderBlock(startPos, Math.min(CHUNK_SIZE, endPos - startPos), __SELF.file);
					}
				});
			} else {
				console.log("Read error: " + evt.target.error);
				return;
			}
		},

		chunkReaderBlock = function(start, size, _file){
			let
			r = new FileReader(),
			blob = _file.slice(start, start + size);
			r.onload = readEventHandler;
			r.readAsArrayBuffer(blob);
		}

		chunkReaderBlock(startPos, Math.min(CHUNK_SIZE, endPos - startPos), __SELF.file);

	}

    //--------------------------------------------------------------------------

	__setAtomLinks = function(id, to, level, parent){
		let
		__SELF = this,
		free = 0,
		stc = 0,
		atm = 0,
		nxt = 0;

		while( id < __SELF.__DATA.ATOMS.length && id > -1 && id < to ){
			atm = __SELF.__DATA.ATOMS[id];
			atm.lvl = level;
			atm.parent = parent;
			stc = {name:atm.name, lvl: level, atoms:[]};
			parent.atoms.push(stc);
			free = ( AtomsFREE.indexOf(atm.name) > -1 );
			if( !free && !AtomsCheck[atm.name+'_'+level] ){
				atm.error = 'Invalid Level';
				__SELF.__DATA.ERRORS.push('Atom "' + atm.name + '": Invalid Level');
			}
			nxt = id;
			id = ( atm.last ) ? __SELF.__DATA.ATOMS.length : __SELF.__atom_indexOf_byPos(atm.next);
			if( id > nxt ){
				if( !free && nxt + 1 < __SELF.__DATA.ATOMS.length && nxt + 1 < id ){
					__SELF.__setAtomLinks(nxt + 1, id, level + 1, stc);
				}
			} else {
				if( atm.next != __SELF.__DATA.fileSize ){
					__SELF.__DATA.ERRORS.push('Atom "' + atm.name + '": Next atom not found');
				}
				break;
			}
		}
	}

    //--------------------------------------------------------------------------

	__parseStruct = function(){
		let
		__SELF = this,
		OUT = {},
		func_struct = function(stc){
			let ch = [];
			stc.atoms.forEach(function(s){
				let
				arr,
				sub = (( s.atoms.length ) ? func_struct(s) : []),
				name = s.name+'_'+s.lvl;
				if( s.lvl > -1 ){
					if( OUT[name]){
						arr = OUT[name].concat(sub);
						OUT[name] = arr.filter((item, pos) => arr.indexOf(item) === pos);
					} else {
						OUT[name] = sub;
					}
					ch.push(s.name);
				}
			});

			ch = ch.filter(function(value, index, self){
				return self.indexOf(value) === index;
			});

			return ch;
		}
		func_struct(__SELF.__DATA.STRUCT.TREE);

		__SELF.__DATA.STRUCT.LEVELS = OUT;
	}

    //--------------------------------------------------------------------------

	__checkAtomsHealth = function(fdone){
		let
		__SELF = this,

		func_check = function(id){
			let
			arr = 0,
			ver = 0,
			offs = 0,
			codc = 0,
			atom = 0,
			nums = 0,
			val1 = 0,
			val2 = 0,
			size = 0;

			if( id < __SELF.__DATA.ATOMS.length ){
				atom = __SELF.__DATA.ATOMS[id];

                //--- check stco atoms

				if( ['stco','co64'].indexOf(atom.name) > -1 ){
					size = ( atom.name == 'co64' ) ? 8 : 4;
					nums = atom.data.getUint32(4);
					atom.entries = [];
					if( nums > 0 && nums < 1024 * 1024 ){
						__SELF.__readFile(atom.pos + 16, nums * size, function(buf){
							if( buf.length == nums * size ){
								val1 = -1;
								for( let i = 0; i < nums; i++ ){
									val2 = ( size == 8 ) ? buf.getUint64(i * size) : buf.getUint32(i * size);
									if( val2 > val1 && val2 < __SELF.__DATA.fileSize ){
										atom.entries.push(val2);
										val1 = val2;
									} else {
										atom.broken = 1;
										func_check(id + 1);
										return;
									}
								}
								atom.size = 16 + nums * size;
								atom.min = Math.min.apply(null, atom.entries);
								atom.max = Math.max.apply(null, atom.entries);
								func_check(id + 1);
							} else {
								atom.broken = 1;
								func_check(id + 1);
							}
						});
					} else {
						atom.broken = 1;
						func_check(id + 1);
					}
				}

                //--- check stsz atoms

				else if( ['stsz'].indexOf(atom.name) > -1 ){
					size = atom.data.getUint32(4);
					atom.samples_size = size;
					atom.entries = [];
					//--- default sample size (if size > 0)
					if( size > 0 ){
						atom.size = 20;
						func_check(id + 1);
					} else {
						size = 4;
						nums = atom.data.getUint32(8);
						atom.size = 20 + nums * size;
						if( nums > 0 && nums < 1024 * 1024 ){
							__SELF.__readFile(atom.pos + 20, nums * size, function(buf){
								if( buf.length == nums * size ){
									for( let i = 0; i < nums; i++ ){
										val1 = buf.getUint32(i * size);
										if( val1 > 0 ){
											atom.entries.push(val1);
										} else {
											atom.broken = 1;
											func_check(id + 1);
											return;
										}
									}
									func_check(id + 1);
								} else {
									atom.broken = 1;
									func_check(id + 1);
								}
							});
						} else {
							atom.broken = 1;
							func_check(id + 1);
						}
					}
				}

                //--- check stts atoms

				else if( ['stts'].indexOf(atom.name) > -1 ){
					size = 8;
					nums = atom.data.getUint32(4);
					atom.size = 16 + nums * size;
					atom.entries = [];
					if( nums > 0 && nums < 1024 * 1024 ){
						__SELF.__readFile(atom.pos + 16, nums * size, function(buf){
							if( buf.length == nums * size ){
								for( let i = 0; i < nums; i++ ){
									atom.entries.push({
										smpl_num: buf.getUint32(i * size),
										smpl_dur: buf.getUint32(i * size + 4)
									});
								}
								func_check(id + 1);
							} else {
								atom.broken = 1;
								func_check(id + 1);
								return;
							}
                        });
					} else {
						atom.broken = 1;
						func_check(id + 1);
					}
				}

                //--- check stsc atoms

				else if( ['stsc'].indexOf(atom.name) > -1 ){
					size = 12;
					nums = atom.data.getUint32(4);
					atom.size = 16 + nums * size;
					atom.entries = [];
					if( nums > 0 && nums < 1024 * 8 ){
						__SELF.__readFile(atom.pos + 16, nums * size, function(buf){
							if( buf.length == nums * size ){
								for( let i = 0; i < nums; i++ ){
									atom.entries.push({
										f_chunk: buf.getUint32(i * size),
										samples: buf.getUint32(i * size + 4),
										smpdesc: buf.getUint32(i * size + 8)
									});
								}
								func_check(id + 1);
							} else {
								atom.broken = 1;
								func_check(id + 1);
								return;
							}
                        });
					} else {
						atom.broken = 1;
						func_check(id + 1);
					}
				} else {
					func_check(id + 1);
				}
			} else {

            	//--- end of check

				__SELF.__DATA.ATOMS = __SELF.__DATA.ATOMS.filter(function(a){ return !a.broken });
				fdone(true);
			}
		}

		if( __SELF.__DATA.ATOMS.length ){
			func_check(0);
		} else {
			__SELF.funcScan({
				owner: __SELF,
				action: 'error',
				desc: 'No atoms found'
			});
			fdone(false);
		}
	}

    //--------------------------------------------------------------------------

	__normalizeAtoms = function(){
		let
		__SELF = this,
		dur = 0,
		tms = 0,
		ratio = 0,

		func_normalize = function(trak){
			let
			item = 0,
			nums = 0,
			smpl_chk = 0,
			smpl_num = 0,
			smpl_dur = 0,

			tkhd = __SELF.__findTrATOMS(['tkhd'], trak),
			stco = __SELF.__findTrATOMS(['stco','co64'], trak),
			stsz = __SELF.__findTrATOMS(['stsz'], trak),
			stsc = __SELF.__findTrATOMS(['stsc'], trak),
			stts = __SELF.__findTrATOMS(['stts'], trak),
			mdhd = __SELF.__findTrATOMS(['mdhd'], trak);

			if( stts.length ){
				stts[0].entries.forEach(function(a, i){
					smpl_num += a.smpl_num;
					smpl_dur += a.smpl_num * a.smpl_dur;
				});
				__SELF.__DATA.PARAMS['STTS_SAMPLES_NUM_'+trak] = smpl_num;
				__SELF.__DATA.PARAMS['STTS_SAMPLES_DUR_'+trak] = smpl_dur;

				if( mdhd.length && smpl_num ){
					__SELF.__DATA.PARAMS['CALC_FPS_'+trak] = Math.round(__SELF.__DATA.PARAMS['TIMESCALE_MDHD_'+trak] / (smpl_dur / smpl_num), 2);
				}
			}

			if( stco.length && stsc.length ){
				stsc[0].entries = stsc[0].entries.filter(function(a){ return a.f_chunk <= stco[0].entries.length });
				stco[0].entries.forEach(function(a, i){
					item = stsc[0].entries.filter(function(b){ return b.f_chunk <= i + 1 });
					if( item.length ){
						smpl_chk += item[0].samples;
					}
				});
				__SELF.__DATA.PARAMS['CALC_SAMPLES_NUM_'+trak] = smpl_chk;
			}
		}

		func_normalize(0);
		func_normalize(1);

		if( !__SELF.__DATA.PARAMS.TIMESCALE_AVG_0 ){
			dur = __SELF.__DATA.PARAMS.DURATION_AVG_0 || __SELF.__DATA.PARAMS.DURATION_AVG || __SELF.__DATA.PARAMS.DURATION_AVG_1;
			ratio = __SELF.__DATA.PARAMS.RATIO_AVG_0 || __SELF.__DATA.PARAMS.RATIO_AVG_1;
			if( dur && ratio ){
				tms = Math.round(dur / ratio);
				if( tms.isRound(1000)){
					__SELF.__DATA.PARAMS.TIMESCALE_AVG_0 = tms;
					if( !__SELF.__DATA.PARAMS.TIMESCALE_MVHD ) __SELF.__DATA.PARAMS.TIMESCALE_MVHD = tms;
					if( !__SELF.__DATA.PARAMS.TIMESCALE_MDHD_0 ) __SELF.__DATA.PARAMS.TIMESCALE_MDHD_0 = tms;
				}
			}
		}

		if( !__SELF.__DATA.PARAMS.TIMESCALE_AVG_1 ){
			dur = __SELF.__DATA.PARAMS.DURATION_MDHD_1 || __SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_1;
			ratio = __SELF.__DATA.PARAMS.RATIO_AVG_0 || __SELF.__DATA.PARAMS.RATIO_AVG_1;
			if( dur && ratio ){
				tms = Math.round(dur / ratio);
				if( tms.isRound(100)){
					__SELF.__DATA.PARAMS.TIMESCALE_AVG_1 = tms;
					if( !__SELF.__DATA.PARAMS.TIMESCALE_MDHD_1 ) __SELF.__DATA.PARAMS.TIMESCALE_MDHD_1 = tms;
				}
			}
		}

		if( !__SELF.__DATA.PARAMS.DURATION_AVG_0 ){
			dur = __SELF.__DATA.PARAMS.DURATION_AVG || __SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_0;
			if( dur ){
				__SELF.__DATA.PARAMS.DURATION_AVG_0 = dur;
				if( !__SELF.__DATA.PARAMS.DURATION_MDHD_0 ) __SELF.__DATA.PARAMS.DURATION_MDHD_0 = dur;
				if( !__SELF.__DATA.PARAMS.DURATION_TKHD_0 ) __SELF.__DATA.PARAMS.DURATION_TKHD_0 = dur;
				if( !__SELF.__DATA.PARAMS.DURATION_ELST_0 ) __SELF.__DATA.PARAMS.DURATION_ELST_0 = dur;
				if( !__SELF.__DATA.PARAMS.DURATION_MVHD ) __SELF.__DATA.PARAMS.DURATION_MVHD = dur;
			}
		}

		if( !__SELF.__DATA.PARAMS.DURATION_AVG_1 ){
			dur = __SELF.__DATA.PARAMS.DURATION_AVG || __SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_1;
			if( dur ){
				__SELF.__DATA.PARAMS.DURATION_AVG_1 = dur;
				if( !__SELF.__DATA.PARAMS.DURATION_TKHD_1 ) __SELF.__DATA.PARAMS.DURATION_TKHD_1 = dur;
				if( !__SELF.__DATA.PARAMS.DURATION_ELST_1 ) __SELF.__DATA.PARAMS.DURATION_ELST_1 = dur;
			}
		}

		if(	__SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_0 && __SELF.__DATA.PARAMS.DURATION_AVG_0 &&
			__SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_0.inRange(__SELF.__DATA.PARAMS.DURATION_AVG_0, 0.2)&&
			__SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_0 < __SELF.__DATA.PARAMS.DURATION_AVG_0 ){
			__SELF.__DATA.PARAMS.DURATION_AVG_0 = __SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_0;
		}

		if(	__SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_1 && __SELF.__DATA.PARAMS.DURATION_AVG_1 &&
			__SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_1.inRange(__SELF.__DATA.PARAMS.DURATION_AVG_1, 0.2)&&
			__SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_1 < __SELF.__DATA.PARAMS.DURATION_AVG_1 ){
			__SELF.__DATA.PARAMS.DURATION_AVG_1 = __SELF.__DATA.PARAMS.STTS_SAMPLES_DUR_1;
		}
	}

    //--------------------------------------------------------------------------

	__is64 = function(){
		let
		__SELF = this;
		return ( __SELF.__findATOMS('co64').length > 0 );
	}

    //--------------------------------------------------------------------------

	__checkMDAT = function(fdone){
		let
		__SELF = this,
		pos = 0,
		mdat = __SELF.__findATOMS('mdat'),

		ffdone = function(res){
        	if( !res ){
				__SELF.funcScan({
					owner: __SELF,
					action: 'error',
					desc: 'Media data is corrupted or not found'
				});
        	}
       		fdone(res);
		},
		func_fix = function(){
			let
			smpl_num = 0,
			nums = [0,0],
			mins = [0,0],
			maxs = [0,0],
			stsz = 0,
			stsc = 0,
			stts = 0,
			atoms = 0,
			trak = 0,
			atom = 0,
			min = 0,
			max = 0;

			atoms = __SELF.__findTrATOMS('stco', 0);
			if( atoms.length ){
				mins[0] = atoms[0].min;
				maxs[0] = atoms[0].max;
			} else {
				atoms = __SELF.__findTrATOMS('co64', 0);
				if( atoms.length ){
					mins[0] = atoms[0].min;
					maxs[0] = atoms[0].max;
				}
			}

			atoms = __SELF.__findTrATOMS('stco', 1);
			if( atoms.length ){
				mins[1] = atoms[0].min;
				maxs[1] = atoms[0].max;
			} else {
				atoms = __SELF.__findTrATOMS('co64', 1);
				if( atoms.length ){
					mins[1] = atoms[0].min;
					maxs[1] = atoms[0].max;
				}
			}

			min = Math.min.apply(null, mins);
			max = Math.max.apply(null, maxs);

			if( min > 0 && max > min && max < __SELF.__DATA.fileSize ){
				atom = ( mdat.length ) ? mdat[0] : new Atom();
				atom.name = 'mdat';
				atom.pos = min - 8;

                trak = ( maxs[0] > maxs[1] ) ? 0 : 1;
				stsc = __SELF.__findTrATOMS('stsc', trak);
				stsz = __SELF.__findTrATOMS('stsz', trak);

				if( stsz.length && stsc.length ){
					smpl_num = 0;
					for( let i = 0; i < nums[trak] - 1; i++ ){
						for( let f = 0; f < stsc[0].entries.length; f++ ){
							if( i + 1 >= stsc[0].entries[f].f_chunk ){
								smpl_num += stsc[0].entries[f].samples;
								break;
							}
						}
					}
					for( let f = smpl_num; f < stsz[0].entries.length; f++ ){
						max += stsz[0].entries[f];
					}
				}

				atom.next = max;
				atom.last = ( atom.next >= __SELF.__DATA.fileSize );
				atom.size = ( atom.next - atom.pos );
				atom.data_offs = 8;
				if( !mdat.length ){
					atom.data = new Uint8Array(ATOM_BUF_SIZE);
					__SELF.__DATA.ATOMS.push(atom);
					__SELF.__DATA.ATOMS.sort(function(a,b){
		        		return ( a.pos > b.pos ) ? 1 : ( a.pos < b.pos ) ? -1 : 0;
					});
					ffdone(true);
				} else {
					ffdone(true);
				}
			} else {
				if( mdat.length ){
					mdat[0].next = __SELF.__DATA.fileSize;
					mdat[0].last = ( mdat[0].next >= __SELF.__DATA.fileSize );
					mdat[0].size = ( mdat[0].next - mdat[0].pos );
				}
				ffdone(false);
			}
		}

		if( mdat.length ){
			pos = __SELF.__atom_indexOf_byPos(mdat[0].next);

			if( pos < 0 && mdat[0].next != __SELF.__DATA.fileSize ){

				__SELF.funcScan({
					owner: __SELF,
					action: 'warning',
					desc: 'Invalid atom size ( mdat )'
				});

				func_fix();
			} else {
				ffdone(true);
			}
		} else {
			__SELF.funcScan({
				owner: __SELF,
				action: 'warning',
				desc: 'Atom not found ( mdat )'
			});
			func_fix();
		}
	}

    //--------------------------------------------------------------------------

	__parseHeaderTracks = function(fdone){
		let
		__SELF = this,
		pos = 0,
		min = 0,
		max = 0,
		val = 0,
		atoms = 0,
		arr_ch = 0,
		arr = 0,
		res = 0,
		atm = 0,
		arr_chnks = [],
		arr_stops = [],
		arr_spots = [];

		//--- find stbl chains
		arr_ch = ['stsd','stts','stsc','stsz','stco','ctts','stss','sdtp','co64'].concat(TPL_ACODEC, TPL_ACODEC_SUB, TPL_VCODEC, TPL_VCODEC_SUB, TPL_TCODEC, AtomsFREE);
		while( pos < __SELF.__DATA.ATOMS.length ){
			atoms = [];
			while( pos < __SELF.__DATA.ATOMS.length && arr_ch.indexOf(__SELF.__DATA.ATOMS[pos].name) > -1 ){
				if( AtomsFREE.indexOf(__SELF.__DATA.ATOMS[pos].name) < 0 ){
					if( atoms.indexOf(__SELF.__DATA.ATOMS[pos]) > -1 ){
						break;
					} else {
		                atoms.push(__SELF.__DATA.ATOMS[pos]);
					}
				}
				pos++;
			}
			if( atoms.length ){
				arr_spots.push(atoms);
			} else {
				pos++;
			}
		}

		//--- remove chains contained < 2 elements

		arr_spots = arr_spots.filter(function(a){ return a.length > 1 });

		//--- scan chains up to tkhd atom

		pos = 0;
		arr = ['hdlr','tkhd','mdhd','vmhd','smhd','nmhd','gmhd','edts','elst','dref','tref','tmcd'];
		arr_stops = ['stsd','stts','stsc','stsz','stco','ctts','stss','sdtp','co64','trak'].concat(TPL_ACODEC, TPL_ACODEC_SUB, TPL_VCODEC, TPL_VCODEC_SUB, AtomsLVL0);

        arr_spots.map(function(a){ return a }).forEach(function(a, i){
        	min = Math.min.apply(null, a.map(function(b){ return b.pos }));
            pos = __SELF.__atom_indexOf_byPos(min) - 1;
			while( pos > 0 ){
				atm = __SELF.__DATA.ATOMS[pos];
				if( arr_stops.indexOf(atm.name) > -1 ){
					break;
				}
				if( arr.indexOf(atm.name) > -1 ){
        			arr_spots[i] = [atm].concat(arr_spots[i]);
				}
				pos--;
			}
        });

        __SELF.__DATA.HEADER.TR_0 = [];
        __SELF.__DATA.HEADER.TR_1 = [];
        __SELF.__DATA.HEADER.TR_2 = [];

		//--- remove unused hdlr atoms

		arr_spots = arr_spots.map(function(a){ return a.filter(function(b){ return ( b.name != 'hdlr' )||( b.name == 'hdlr' && ['vide','soun','tmcd'].indexOf(b.data.getString(8, 4)) > -1 )})});

		//--- detect type of trak #1

        arr_spots.forEach(function(a, i){
			arr = a.map(function(b){ return b.name });

			arr_stops = ['vmhd'].concat(TPL_VCODEC);
			if( arr_stops.some(function(c){ return arr.includes(c)})){
				arr_spots[i] = {
					track: 1,
					atoms: a
				}
				return;
			}

			arr_stops = ['smhd'].concat(TPL_ACODEC);
			if( arr_stops.some(function(c){ return arr.includes(c)})){
				arr_spots[i] = {
					track: 2,
					atoms: a
				}
				return;
			}

			arr_stops = ['nmhd','gmhd'];
			if( arr_stops.some(function(c){ return arr.includes(c)})){
				arr_spots[i] = {
					track: 3,
					atoms: a
				}
				return;
			}
		});


		//--- detect type of trak #2

        arr_spots.forEach(function(a, i){
        	if( Array.isArray(a)){
	        	pos = a.map(function(b){ return b.name }).indexOf('tkhd');
				if( pos > -1 ){
        	    	val = a[pos].data.getUint32(12);
					if( [1,2,3].indexOf(val) > -1 ){
        				arr_spots[i] = {
        					track: val,
							atoms: a
        				}
					}
	        	} else {
		        	pos = a.map(function(b){ return b.name }).indexOf('hdlr');
					if( pos > -1 ){
						val = a.data.getString(8, 4);
						if( val == 'vide' ){
							arr_spots[i] = {
								track: 1,
								atoms: a
							}
						} else
						if( val == 'soun' ){
							arr_spots[i] = {
								track: 2,
								atoms: a
							}
						} else
						if( val == 'tmcd' ){
							arr_spots[i] = {
								track: 3,
								atoms: a
							}
						}
					}
	        	}
			}
        });

		let
		stsz_min = 0,
		stco_min = 0;

        arr_spots.forEach(function(a){
        	if( typeof a === 'object' && !Array.isArray(a)){
        		a.atoms.forEach(function(atom){
					pos = __SELF.__DATA.HEADER['TR_'+(a.track-1)].map(function(c){ return c.name }).indexOf(atom.name);
					if( pos > -1 ){
						__SELF.__DATA.HEADER['TR_'+(a.track-1)][pos] = atom;
					} else {
 						__SELF.__DATA.HEADER['TR_'+(a.track-1)].push(atom);
					}
        		});
        	}
		});

		res = ( __SELF.__DATA.HEADER.TR_0.length || __SELF.__DATA.HEADER.TR_1.length );
		if( res ){
			atoms = __SELF.__findTrATOMS(['stco','co64'], 0);
			if( atoms.length ){
				arr_chnks = arr_chnks.concat(atoms[0].entries.map(function(a){ return {trak:0, offs:a} }));
			}
			atoms = __SELF.__findTrATOMS(['stco','co64'], 1);
			if( atoms.length ){
				arr_chnks = arr_chnks.concat(atoms[0].entries.map(function(a){ return {trak:1, offs:a} }));
			}
			arr_chnks.sort(function(a,b){ return ( a.offs > b.offs ) ? 1 : ( a.offs < b.offs ) ? -1 : 0 });
			__SELF.__DATA.CHUNKS = arr_chnks;
		} else {
			__SELF.funcScan({
				owner: __SELF,
				action: 'error',
				desc: 'Tracks not found'
			});
		}
		fdone(res);
		return res;
	}

    //--------------------------------------------------------------------------

	__buildFile = function(){
		let
		__SELF = this;
	}

    //--------------------------------------------------------------------------

	__buildHeader = function(func){
		let
		__SELF = this;
	}

    //--------------------------------------------------------------------------

	__parseOffsets = function(funcDone){
		let
		__SELF = this,
		num = 0,
		len = 0,
		offs = 0,
		arr = [],
		fnd = 0,
		bit = 0,
		tmp = 0,
		tmp_arr = [],
		stco_arr = [],
		offs_arr = [],
		sign_arr = {0:[],1:[]},
		smpl = 0,
		stco = 0,
		stsz = 0,
		stco_num = 0,
		stsz_num = 0,
		atoms = 0,
		func_fill_data = function(ps, ar, fdone){
			let
			val = 0,
			bin = 0;
			if( ps < ar.length ){
				__SELF.__readFile(ar[ps].pos, PATTERN_BYTE_LEN, function(buf){
					if( buf.length < PATTERN_BYTE_LEN ){
						__SELF.__DATA.ERRORS.push('[func_fill_data] Unable to read file from ' + ar[ps].pos + ' length '+ PATTERN_BYTE_LEN);
						fdone();
						return;
					}
					ar[ps].bin = buf.subarray(0, PATTERN_BYTE_LEN).getBinString();
					ar[ps].hex = buf.subarray(0, 16).getHex();
					ar[ps].dat = buf.subarray(0, 96);
					func_fill_data(ps + 1, ar, fdone);
				});
			} else {
				fdone();
			}
		},
		func_fill_stco = function(x, fdone){
			let
			num_x = 0,
			pos_x = 0,
			stco_x = __SELF.__findTrATOMS(['stco','co64'], x);
			if( stco_x.length ){
				__SELF.__readFile(stco_x[0].pos, stco_x[0].size, function(buf){
					if( buf.length < stco_x[0].size ){
						__SELF.__DATA.ERRORS.push('[func_fill_stco] Unable to read file from ' + stco_x[0].pos + ' length '+ stco_x[0].size);
						fdone();
						return;
					}
					num_x = buf.getUint32(12);
					for( let i = 0; i < Math.min(Math.floor((buf.length - 20)/(( stco_x[0].name == 'co64' ) ? 8 : 4)), num_x); i++ ){
						pos_x = ( stco_x[0].name == 'co64' ) ? buf.getUint64(16 + i * 8) : buf.getUint32(16 + i * 4);
						stco_arr.push({tr:x, pos:pos_x});
					}
					fdone();
				});
			} else {
				fdone();
			}
		},
		func_fill_stsz = function(x, fdone){
			let
			tmp_x = 0,
			num_x = 0,
			min_x = 0,
			max_x = 0,
			pos_x = 0,
			sum_x = 0,
			len_x = 0,
			arr_x = [],
			stsz_x = __SELF.__findTrATOMS('stsz', x),
			stsc_x = __SELF.__findTrATOMS('stsc', x),
			stsc_num = 0,
			stsc_pos = 0,
			stsc_len = 0,
			stsc_max = 0,
			stsc_sum = 0,
			stsc_arr = [];
			if( stsz_x.length ){
				__SELF.__readFile(stsz_x[0].pos, stsz_x[0].size, function(buf){
					if( buf.length < stsz_x[0].size ){
						__SELF.__DATA.ERRORS.push('[func_fill_stsz] Unable to read file from ' + stsz_x[0].pos + ' length '+ stsz_x[0].size);
						fdone();
						return;
					}
					len_x = buf.getUint32(12);
					num_x = buf.getUint32(16);
					if( buf.length > 20 ){
						for( let i = 0; i < Math.min(Math.floor((buf.length - 20)/4), num_x); i++ ){
							arr_x.push(buf.getUint32(20 + i * 4));
						}
					} else {
						if( stsc_x.length ){
                        	stsc_num = stsc_x[0].data.getUint32(4);
							for( let i = 0; i < stsc_num; i++ ){
								stsc_arr.push({start:stsc_x[0].data.getUint32(8 + i * 12), num:stsc_x[0].data.getUint32(12 + i * 12)})
							}
							for( let i = 0; i < stsc_arr.length; i++ ){
								stsc_max = ( i + 1 < stsc_arr.length ) ? stsc_arr[i + 1].start : num_x;
								stsc_len = ( stsc_max - stsc_arr[i].start );
								for( let j = 0; j < stsc_len; j++ ){
									arr_x.push(stsc_arr[i].num * len_x);
								}
							}
						}
					}

					for( let i = 0; i < stco_arr.length; i++ ){
						max_x = ( i + 1 < stco_arr.length ) ? stco_arr[i + 1].pos : Number.MAX_SAFE_INTEGER;
						if( stco_arr[i].tr == x ){
							sum_x = 0;
							while( pos_x < num_x && stco_arr[i].pos + sum_x < max_x ){
                                offs_arr.push({pos:stco_arr[i].pos + sum_x, tr:x, len:arr_x[pos_x]});
								sum_x += arr_x[pos_x++];
							}
						}
					}
					fdone();
				});
			} else {
				fdone();
			}
		},
		func_find_pattern = function(x, fdone){
			let
			pat = '',
			bit = 0,
			fnd = 0,
			arr = __SELF.__DATA.OFFSETS.filter(function(a){ return a.tr == x }).map(function(a){ return a.bin });

			if( !arr.length ){
				fdone();
				return;
			}

			for( let i = 0; i < PATTERN_BYTE_LEN * 8; i++ ){
				bit = -1;
				fnd = 1;
				for( let j = 0; j < arr.length; j++ ){
					if( bit < 0 ) bit = arr[j].substring(i, i+1);
					if(	arr[j].substring(i, i+1) != bit ){
						fnd = 0;
						break;
					}
				}
				pat += ( fnd ) ? bit : '-';
			}
			if( !__SELF.__DATA.PAT ) __SELF.__DATA.PAT = {};
			__SELF.__DATA.PAT[x] = pat;
			fdone();
		},
		func_analyze = function(fdone){
			let
			arr = __SELF.__DATA.OFFSETS.filter(function(a){ return a.tr == 0 }),
			frag_type = 0,
			nal_type = 0,
			start_bit = 0;

			for( let i = 0; i < arr.length; i++ ){
				for( let j = 0; j < 92; j++ ){
			        frag_type = arr[i].dat[j] & 0x1F;
					nal_type = arr[i].dat[j+1] & 0x1F;
					start_bit = arr[i].dat[j+1] & 0x80;
					if((( frag_type == 28 || frag_type == 29) && nal_type == 5 && start_bit == 128) || frag_type == 5){
						console.log('offs:', j);
						break;
					}
				}
			}
			fdone();
		}


		if( !__SELF.__DATA.OFFSETS ){
			__SELF.__DATA.OFFSETS = [];
		}


		func_fill_stco(0, function(){
			func_fill_stco(1, function(){
				stco_arr.sort(function(a,b){ return (a.pos > b.pos)? 1: (( a.pos < b.pos ) ? -1: 0)});
				func_fill_stsz(0, function(){
					func_fill_stsz(1, function(){
						offs_arr.sort(function(a,b){ return (a.pos > b.pos)? 1: (( a.pos < b.pos ) ? -1: 0)});
						func_fill_data(0, offs_arr, function(){
							__SELF.__DATA.OFFSETS = offs_arr;
							funcDone();
						});
					});
				});
			});
		});
	}

    //--------------------------------------------------------------------------

	__parseAtoms = function(){
		let
		__SELF = this,
		arr = [],
		pos = 0,
		min = 0,
		max = 0,
		atms = 0;

        //--- sort atoms by their positions

		__SELF.__DATA.ATOMS.sort(function(a,b){
        	return ( a.pos > b.pos ) ? 1 : ( a.pos < b.pos ) ? -1 : 0;
		});

        //--- filter false atoms via their sizes
		/*
		__SELF.__DATA.ATOMS = __SELF.__DATA.ATOMS.filter(function(a){
			return ( a.name == 'mdat' ) || ( a.size < 1024 * 1024 );
		});

        atms = __SELF.__findATOMS(__SELF.__emptyAtomNames());
		if( atms.length ){
			for( let i = 0; i < atms.length ; i++ ){
				pos = __SELF.__atom_indexOf_byPos(atms[i].next);
				if( pos > -1 || atms[i].last ){
                    min = atms[i].pos + 8;
					max = atms[i].next;
					__SELF.__DATA.ATOMS = __SELF.__DATA.ATOMS.filter(function(a){
						return !( a.pos >= min && a.next <= max );
					});
				}
			}
        }
		*/
        //--- multi moov protection
        /*
		atms = __SELF.__findATOMS('moov');
		if( atms.length > 1 ){
			__SELF.funcScan({
				owner: __SELF,
               action: 'warning',
			   desc: 'Multiple moov atoms found'
			});

			min = atms[0].pos;
			max = atms[atms.length-1].pos;
			__SELF.__DATA.ATOMS = __SELF.__DATA.ATOMS.filter(function(a){
				return ( a.pos < min || a.pos >= max );
			});
		}
		*/
	}

    //--------------------------------------------------------------------------

	__parseMediaData = function(){
		let
		__SELF = this,
		tmp = new Uint8Array(8),
		val = 0,
		ver = 0,
		num = 0,
		obj = 0,
		arr = 0,
		offs = 0,
		atoms = 0,
		a1, a2,

        mvhd = __SELF.__findATOMS('mvhd', 0),

		mdhd_0 = __SELF.__findTrATOMS('mdhd', 0),
		mdhd_1 = __SELF.__findTrATOMS('mdhd', 1),

		tkhd_0 = __SELF.__findTrATOMS('tkhd', 0),
		tkhd_1 = __SELF.__findTrATOMS('tkhd', 1),

		elst_0 = __SELF.__findTrATOMS('elst', 0),
		elst_1 = __SELF.__findTrATOMS('elst', 1),

		codv = __SELF.__findTrATOMS(['avc1','hvc1'], 0),
		coda = __SELF.__findTrATOMS(['mp4a'], 1);

        //--- MDHD -------------------------------------------------------------

        if( mdhd_0.length ){
			ver = mdhd_0[0].data.getVersion();
			val = mdhd_0[0].data.getUint32(( ver == 1 ) ? 20 : 12);
			if( val > 0 && val.isRound(1000)){
				__SELF.__DATA.PARAMS.TIMESCALE_MDHD_0 = val;
			}
			val = ( ver == 1 ) ? mdhd_0[0].data.getUint64(24) : mdhd_0[0].data.getUint32(16);
			__SELF.__DATA.PARAMS.DURATION_MDHD_0 = val;
        }

        if( mdhd_1.length ){
			ver = mdhd_1[0].data.getVersion();
			val = mdhd_1[0].data.getUint32(( ver == 1 ) ? 20 : 12);
			if( val > 0 && val.isRound(100)){
				__SELF.__DATA.PARAMS.TIMESCALE_MDHD_1 = val;
			}
			val = ( ver == 1 ) ? mdhd_1[0].data.getUint64(24) : mdhd_1[0].data.getUint32(16);
			__SELF.__DATA.PARAMS.DURATION_MDHD_1 = val;
        }

		//--- MVHD -------------------------------------------------------------

		if( mvhd.length ){
			ver = mvhd[0].data.getVersion();
			val = ( ver == 1 ) ? mvhd[0].data.getUint64(24) : mvhd[0].data.getUint32(16);
			__SELF.__DATA.PARAMS.DURATION_MVHD = val;
			val = mvhd[0].data.getUint32(( ver == 1 ) ? 20 : 12);
			__SELF.__DATA.PARAMS.TIMESCALE_MVHD = val;
		}

		//--- TKHD -------------------------------------------------------------

		if( tkhd_0.length ){
			ver = tkhd_0[0].data.getVersion();
			val = ( ver == 1 ) ? tkhd_0[0].data.getUint64(28) : tkhd_0[0].data.getUint32(20);
			__SELF.__DATA.PARAMS.DURATION_TKHD_0 = val;
			val = tkhd_0[0].data.getUint16(( ver == 1 ) ? 88 : 76);
			__SELF.__DATA.PARAMS.TRACKWIDTH_TKHD_0 = val;
			val = tkhd_0[0].data.getUint16(( ver == 1 ) ? 92 : 80);
			__SELF.__DATA.PARAMS.TRACKHEIGHT_TKHD_0 = val;
		}
		if( tkhd_1.length ){
			ver = tkhd_1[0].data.getVersion();
			val = ( ver == 1 ) ? tkhd_1[0].data.getUint64(28) : tkhd_1[0].data.getUint32(20);
			__SELF.__DATA.PARAMS.DURATION_TKHD_1 = val;
			val = tkhd_1[0].data.getUint16(( ver == 1 ) ? 88 : 76);
			__SELF.__DATA.PARAMS.TRACKWIDTH_TKHD_1 = val;
			val = tkhd_1[0].data.getUint16(( ver == 1 ) ? 92 : 80);
			__SELF.__DATA.PARAMS.TRACKHEIGHT_TKHD_1 = val;
		}

		//--- ELST -------------------------------------------------------------

		if( elst_0.length ){
			ver = elst_0[0].data.getVersion();
			num = elst_0[0].data.getUint32(4);
			val = 0;
			for( let i = 0; i < num; i++ ){
				val += ( ver == 1 ) ? elst_0[0].data.getUint64(8 + i * 16) : elst_0[0].data.getUint32(8 + i * 8);
			}
			__SELF.__DATA.PARAMS.DURATION_ELST_0 = val;
		}
		if( elst_1.length ){
			ver = elst_1[0].data.getVersion();
			num = elst_1[0].data.getUint32(4);
			val = 0;
			for( let i = 0; i < num; i++ ){
				val += ( ver == 1 ) ? elst_1[0].data.getUint64(8 + i * 16) : elst_1[0].data.getUint32(8 + i * 8);
			}
			__SELF.__DATA.PARAMS.DURATION_ELST_1 = val;
		}

		//--- CODV -------------------------------------------------------------

		if( codv.length ){
			//--- video format
			__SELF.__DATA.PARAMS.FORMAT_CODV = codv[0].name;
			if( codv[0].name == 'avc1' ){
				__SELF.__DATA.PARAMS.TRACKWIDTH_CODV = codv[0].data.getUint16(24);
				__SELF.__DATA.PARAMS.TRACKHEIGHT_CODV = codv[0].data.getUint16(26);
			} else
			if( codv[0].name == 'hvc1' ){
				__SELF.__DATA.PARAMS.TRACKWIDTH_CODV = codv[0].data.getUint16(32);
				__SELF.__DATA.PARAMS.TRACKHEIGHT_CODV = codv[0].data.getUint16(34);
			}
		}

		//--- CODA -------------------------------------------------------------

		if( coda.length ){
			//--- audio format
			__SELF.__DATA.PARAMS.FORMAT_CODA = coda[0].name;
			//--- sampleRate
			__SELF.__DATA.PARAMS.SAMPLERATE_CODA = coda[0].data.getUint32(22);
			//--- numChannels
			__SELF.__DATA.PARAMS.NUMCHANNELS_CODA = coda[0].data.getUint16(16);
			//--- sampleSize
			__SELF.__DATA.PARAMS.SAMPLESIZE_CODA = coda[0].data.getUint16(18);
		}

		//--- AVG DURATION -----------------------------------------------------

		arr = [];
		if(	__SELF.__DATA.PARAMS.DURATION_MDHD_0 ) arr.push(__SELF.__DATA.PARAMS.DURATION_MDHD_0);
		if(	__SELF.__DATA.PARAMS.DURATION_TKHD_0 ) arr.push(__SELF.__DATA.PARAMS.DURATION_TKHD_0);
		if(	__SELF.__DATA.PARAMS.DURATION_ELST_0 ) arr.push(__SELF.__DATA.PARAMS.DURATION_ELST_0);
		if(	__SELF.__DATA.PARAMS.DURATION_TKHD_1 ) arr.push(__SELF.__DATA.PARAMS.DURATION_TKHD_1);
		if(	__SELF.__DATA.PARAMS.DURATION_ELST_1 ) arr.push(__SELF.__DATA.PARAMS.DURATION_ELST_1);
		if(	__SELF.__DATA.PARAMS.DURATION_MVHD ) arr.push(__SELF.__DATA.PARAMS.DURATION_MVHD);
		__SELF.__DATA.PARAMS.DURATION_AVG = arr.median();

		arr = [];
		if(	__SELF.__DATA.PARAMS.DURATION_MDHD_0 ) arr.push(__SELF.__DATA.PARAMS.DURATION_MDHD_0);
		if(	__SELF.__DATA.PARAMS.DURATION_TKHD_0 ) arr.push(__SELF.__DATA.PARAMS.DURATION_TKHD_0);
		if(	__SELF.__DATA.PARAMS.DURATION_ELST_0 ) arr.push(__SELF.__DATA.PARAMS.DURATION_ELST_0);
		if(	__SELF.__DATA.PARAMS.DURATION_MVHD ) arr.push(__SELF.__DATA.PARAMS.DURATION_MVHD);
		__SELF.__DATA.PARAMS.DURATION_AVG_0 = arr.median();

		arr = [];
		if(	__SELF.__DATA.PARAMS.DURATION_TKHD_1 ) arr.push(__SELF.__DATA.PARAMS.DURATION_TKHD_1);
		if(	__SELF.__DATA.PARAMS.DURATION_ELST_1 ) arr.push(__SELF.__DATA.PARAMS.DURATION_ELST_1);
		__SELF.__DATA.PARAMS.DURATION_AVG_1 = arr.median();

		arr = [];
		if(	__SELF.__DATA.PARAMS.TIMESCALE_MDHD_0 ) arr.push(__SELF.__DATA.PARAMS.TIMESCALE_MDHD_0);
		if(	__SELF.__DATA.PARAMS.TIMESCALE_MVHD ) arr.push(__SELF.__DATA.PARAMS.TIMESCALE_MVHD);
		__SELF.__DATA.PARAMS.TIMESCALE_AVG_0 = arr.median();

		arr = [];
		if(	__SELF.__DATA.PARAMS.TIMESCALE_MDHD_1 ) arr.push(__SELF.__DATA.PARAMS.TIMESCALE_MDHD_1);
		if(	__SELF.__DATA.PARAMS.SAMPLERATE_CODA ) arr.push(__SELF.__DATA.PARAMS.SAMPLERATE_CODA);
		__SELF.__DATA.PARAMS.TIMESCALE_AVG_1 = arr.median();

		if(	__SELF.__DATA.PARAMS.DURATION_AVG_0 && __SELF.__DATA.PARAMS.TIMESCALE_AVG_0 ){
			__SELF.__DATA.PARAMS.RATIO_AVG_0 = __SELF.__DATA.PARAMS.DURATION_AVG_0 / __SELF.__DATA.PARAMS.TIMESCALE_AVG_0;
		}

		if(	__SELF.__DATA.PARAMS.DURATION_MDHD_1 && __SELF.__DATA.PARAMS.TIMESCALE_MDHD_1 ){
			__SELF.__DATA.PARAMS.RATIO_AVG_1 = __SELF.__DATA.PARAMS.DURATION_MDHD_1 / __SELF.__DATA.PARAMS.TIMESCALE_MDHD_1;
		}

		arr = [];
		if(	__SELF.__DATA.PARAMS.TRACKWIDTH_TKHD_0 ) arr.push(__SELF.__DATA.PARAMS.TRACKWIDTH_TKHD_0);
		if(	__SELF.__DATA.PARAMS.TRACKWIDTH_CODV ) arr.push(__SELF.__DATA.PARAMS.TRACKWIDTH_CODV);
		__SELF.__DATA.PARAMS.TRACKWIDTH_AVG = arr.median();

		arr = [];
		if(	__SELF.__DATA.PARAMS.TRACKHEIGHT_TKHD_0 ) arr.push(__SELF.__DATA.PARAMS.TRACKHEIGHT_TKHD_0);
		if(	__SELF.__DATA.PARAMS.TRACKHEIGHT_CODV ) arr.push(__SELF.__DATA.PARAMS.TRACKHEIGHT_CODV);
		__SELF.__DATA.PARAMS.TRACKHEIGHT_AVG = arr.median();

        //--- FTYP

		atoms = __SELF.__findATOMS('ftyp');
		if( atoms.length ){
			//--- ftyp: major brand
			atoms[0].entries = [];
			atoms[0].entries.push(atoms[0].data.getString(0, 4).padEnd(4, ' '));
			val = atoms[0].data.getUint32(4);
            atoms[0].entries.push(val.toString().padStart(8, '0'));
			for( let i = 0; i < (atoms[0].size - 16)/4; i++ ){
				if( atoms[0].data.isString(8 + i * 4, 4)){
					val = atoms[0].data.getString(8 + i * 4, 4).padEnd(4, ' ');
					atoms[0].entries.push(val);
				} else {
					break;
				}
			}
			__SELF.__DATA.PARAMS.FTYP = atoms[0].entries.join(',');
		}
	}

	//--------------------------------------------------------------------------

	__parseHeaderSpot = function(fdone){
		let
		__SELF = this,
		pos = 0,
		atm = 0,
		arr = TPL_HEADER_NAMES,
		med = [],
		nxt = [],
		res = 0;

		__SELF.__DATA.ATOMS.forEach(function(a){
			if( arr.indexOf(a.name) > -1 ){
            	med.push(a.pos);
            	nxt.push(a.next);
			}
		});

        if( !med.length ){
			__SELF.funcScan({
				owner: __SELF,
				action: 'error',
				desc: 'Header not found'
			});
			res = false;
			fdone(res);
			return res;
        }

        __SELF.__DATA.HEADER.spot_center = abi_median(med);
        __SELF.__DATA.HEADER.spot_center = abi_median(med);
        __SELF.__DATA.HEADER.spot_begin = Math.min.apply(null, med);
        __SELF.__DATA.HEADER.spot_end = Math.max.apply(null, nxt);
        __SELF.__DATA.HEADER.spot_size = __SELF.__DATA.HEADER.spot_end - __SELF.__DATA.HEADER.spot_begin;
        __SELF.__DATA.HEADER.spot_count = med.length;
        /*
		pos = __SELF.__atom_indexOf_byPos(__SELF.__DATA.HEADER.spot_begin);
		if( __SELF.__DATA.ATOMS[pos].name != 'moov' ){
			for( let i = pos; i >= 0; i-- ){
				if( AtomsCheck[__SELF.__DATA.ATOMS[i].name + '_0']){
        			__SELF.__DATA.HEADER.spot_begin = __SELF.__DATA.ATOMS[i].next;
					if( !__SELF.__findATOMS('moov').length ){
                		atm = new Atom();
						atm.name = 'moov';
						atm.pos = __SELF.__DATA.HEADER.spot_begin;
						atm.lost = 1;
						atm.lvl = 0;
						__SELF.__DATA.ATOMS.splice(i + 1, 0, atm);
					}
					break;
				}
			}
		}
        */
		__SELF.__DATA.ATOMS = __SELF.__DATA.ATOMS.filter(function(a){
			if( arr.indexOf(a.name) > -1 ){
				return (( a.pos > __SELF.__DATA.HEADER.spot_begin - 1024 * 5 ) && ( a.pos < __SELF.__DATA.HEADER.spot_end + 1024 * 5 ));
			} else {
				return true;
			}
		});

		res = true;
		fdone(res);
		return res;
	}

	//--------------------------------------------------------------------------

	__parseChunks = function(funcDone){
		let
		__SELF = this,
		mdat = __SELF.__findATOMS('mdat'),
		state = NAL_BYTE_STATE['0-7'],
		unitPos = -1,
		unitType,
		prevDATA = new Uint8Array();

		if( !mdat.length ){
        	funcDone();
			return;
		}

		__SELF.__DATA.NALU = [];

		__SELF.__readFileChunks(mdat[0].pos + 8, mdat[0].size - 8, function(buf, initOFFS){
			let
			byte,
			nalDATA = prevDATA.concat(new Uint8Array(buf)),
			nalLEN = nalDATA.length,
			nalPOS = 0;

			while( nalPOS < nalLEN ){
				byte = nalDATA[nalPOS++];
				if( state === NAL_BYTE_STATE['0-7']){
					state = byte ? NAL_BYTE_STATE['0-7'] : NAL_BYTE_STATE['8-15'];
					continue;
				}
				if( state === NAL_BYTE_STATE['8-15']){
					state = byte ? NAL_BYTE_STATE['0-7'] : NAL_BYTE_STATE['16-23'];
					continue;
				}
 				if( state === NAL_BYTE_STATE['16-23'] || state === NAL_BYTE_STATE['24-31']){
					if( byte === 0 ){
						state = NAL_BYTE_STATE['24-31'];
					} else
					if( byte === NAL_START_PREFIX ){
						//console.log('Start Prefix at '+ (initOFFS + nalPOS));
						if( unitPos >= 0 ){
							console.log('NAL unit '+ NAL_UNIT_TYPE[unitType] + 'starting at ' + (initOFFS + unitPos) + ' and ends at ' + (initOFFS + (nalPOS - state - 1)));
							const nalu = new Uint8Array(nalDATA.slice(unitPos, nalPOS - state - 1));

							__SELF.__DATA.NALU.push({
								data: nalu,
								type: NAL_UNIT_TYPE[unitType]
							});
						}
						unitType = nalDATA[nalPOS] & 0x1f;
						unitPos = nalPOS;
					} else {
						state = NAL_BYTE_STATE['0-7'];
					}
				}
			}
			if( unitPos >= 0 ){
				prevDATA = nalDATA.slice(unitPos, nalLEN);
				unitPos = 0;
			}
		}, funcDone);
	}

	//--------------------------------------------------------------------------

	__atom_indexOf_byPos = function(pos){
		let
		__SELF = this,
		atm = 0;

    	for( let i = 0; i < __SELF.__DATA.ATOMS.length; i++ ){
			atm = __SELF.__DATA.ATOMS[i];
			if( atm.pos == pos ){
				return i;
			}
    	}
		return -1;
	}

	//--------------------------------------------------------------------------

	__parseDATA = function(){
		let
		__SELF = this;

		__SELF.funcScan({
			owner: __SELF,
			action: 'parsing_start'
		});

		__SELF.__parseAtoms();
		__SELF.__checkAtomsHealth(function(ok){
			if( ok || __SELF.options.ignoreErrors ){
				__SELF.__parseHeaderSpot(function(ok){
					if( ok || __SELF.options.ignoreErrors ){
						__SELF.__parseHeaderTracks(function(ok){
							if( ok || __SELF.options.ignoreErrors ){
								__SELF.__parseMediaData();
								__SELF.__normalizeAtoms();
								__SELF.funcScan({
									owner: __SELF,
									action: 'parsing_end'
								});
						        __SELF.__checkMDAT(function(ok){
		    		    			if( ok || __SELF.options.ignoreErrors ){
										if( __SELF.repair ){
											__SELF.__buildHeader(function(nodes){
												__SELF.__buildFile();
											});
										} else {
											if( __SELF.funcDone ){
												__SELF.funcDone(__SELF.__DATA);
											}
										}
									}
					    	    });
							}
						});
					}
				});
			}
		});
	}
}


