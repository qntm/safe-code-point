import { describe, it } from 'node:test'

import dehex from './dehex.js'
import SafeCodePoint from './index.js'

const numCodePoints = (1 << 16) + (1 << 20)
const getNumSafeCodePoints = safeCodePoint => {
  let numSafeCodePoints = 0
  for (let codePoint = 0; codePoint < numCodePoints; codePoint++) {
    if (safeCodePoint(codePoint)) {
      numSafeCodePoints++
    }
  }
  return numSafeCodePoints
}

describe('safe-code-point', () => {
  let scp7
  let scp8
  let scp9
  let scp10
  let scp11
  let scp12
  let scp13
  let scp17

  // First load some files
  beforeAll(async () => {
    scp7 = await SafeCodePoint('7.0.0')
  })
  beforeAll(async () => {
    scp8 = await SafeCodePoint('8.0.0')
  })
  beforeAll(async () => {
    scp9 = await SafeCodePoint('9.0.0')
  })
  beforeAll(async () => {
    scp10 = await SafeCodePoint('10.0.0')
  })
  beforeAll(async () => {
    scp11 = await SafeCodePoint('11.0.0')
  })
  beforeAll(async () => {
    scp12 = await SafeCodePoint('12.0.0')
  })
  beforeAll(async () => {
    scp13 = await SafeCodePoint('13.0.0')
  })
  beforeAll(async () => {
    scp17 = await SafeCodePoint('17.0.0')
  })

  describe('canonicalCombiningClass', () => {
    it('works', () => {
      expect(scp8.canonicalCombiningClass(0)).toBe(0)
      expect(scp8.canonicalCombiningClass(30)).toBe(0)
      expect(scp8.canonicalCombiningClass(parseInt('0345', 16))).toBe(240)
    })
  })

  describe('dehex', () => {
    it('works', () => {
      expect(dehex('0000')).toEqual([0])
      expect(dehex('0000..0002')).toEqual([0, 1, 2])
      expect(dehex('000A..000C')).toEqual([10, 11, 12])
    })
  })

  describe('eastAsianWidth', () => {
    it('works', () => {
      expect(scp8.eastAsianWidth(0)).toBe('N')
      expect(scp8.eastAsianWidth(0x001F)).toBe('N')
      expect(scp8.eastAsianWidth(0x0020)).toBe('Na')

      expect(scp9.eastAsianWidth(0x00F8)).toBe('A')
      expect(() => scp9.eastAsianWidth(0xABFF)).toThrow()

      expect(() => scp10.eastAsianWidth(0xE1000)).toThrow()
      expect(scp10.eastAsianWidth(0x30000)).toBe('W')
    })
  })

  describe('generalCategory', () => {
    it('works', () => {
      expect(scp9.generalCategory(0)).toBe('Cc')
      expect(scp9.generalCategory(31)).toBe('Cc')
      expect(scp9.generalCategory(parseInt('055A', 16))).toBe('Po')
    })
  })

  describe('normalizationProperties', () => {
    it('works', () => {
      expect(scp10.normalizationProperties(parseInt('037A', 16), 'FC_NFKC')).toBe('0020 03B9')
      expect(scp10.normalizationProperties(parseInt('E0002', 16), 'NFKC_CF')).toBe('')
      expect(scp10.normalizationProperties(parseInt('FB1D', 16), 'NFC_QC')).toBe('N')
      expect(scp10.normalizationProperties(parseInt('10FFFF', 16), 'NFKD_QC')).toBe('Y')
    })
  })

  describe('wordBreak', () => {
    it('works', () => {
      expect(() => scp13.wordBreak(-1)).toThrow()
      expect(scp13.wordBreak(parseInt('0000', 16))).toBeUndefined()
      expect(scp13.wordBreak(parseInt('0022', 16))).toBe('Double_Quote')
      expect(scp13.wordBreak(parseInt('0065', 16))).toBe('ALetter')
    })
  })

  describe('safeCodePoint', () => {
    it('works', () => {
      expect(scp12(0)).toBe(false)
      expect(scp12(36)).toBe(true)
      expect(scp12(65)).toBe(true)
    })

    it('README example', () => {
      expect(getNumSafeCodePoints(scp7)).toBe(93510)
      expect(getNumSafeCodePoints(scp8)).toBe(101064)
      expect(getNumSafeCodePoints(scp9)).toBe(108397)
      expect(getNumSafeCodePoints(scp10)).toBe(116813)
      expect(getNumSafeCodePoints(scp11)).toBe(117422)
      expect(getNumSafeCodePoints(scp12)).toBe(117927)
    })
  })

  describe('base65536', () => {
    it('works', () => {
      const safeRange = (min, max) => {
        for (let codePoint = min; codePoint < max; codePoint++) {
          if (scp8.generalCategory(codePoint) !== 'Lo' || !scp8(codePoint)) {
            return false
          }
        }
        return true
      }

      const getAllSafeRanges = rangeSize => {
        const allSafeRanges = []
        for (let codePoint = 0; codePoint < (1 << 16) + (1 << 20); codePoint += rangeSize) {
          if (safeRange(codePoint, codePoint + rangeSize)) {
            allSafeRanges.push(codePoint)
          }
        }
        return allSafeRanges
      }

      const allSafeRanges = getAllSafeRanges(1 << 8)

      const paddingBlockStart = String.fromCodePoint(allSafeRanges.shift())
      expect(paddingBlockStart).toBe('ᔀ')

      const blockStarts = allSafeRanges.slice(0, 1 << 8).map(x => String.fromCodePoint(x)).join('')
      expect(blockStarts).toBe(
        '㐀㔀㘀㜀㠀㤀㨀㬀㰀㴀㸀㼀䀀䄀䈀䌀' +
        '䐀䔀䘀䜀䠀䤀䨀䬀䰀一伀倀儀刀匀吀' +
        '唀嘀圀堀夀娀嬀尀崀帀开怀愀戀挀搀' +
        '攀昀最栀椀樀欀氀洀渀漀瀀焀爀猀琀' +
        '甀瘀眀砀礀稀笀簀紀縀缀耀脀舀茀萀' +
        '蔀蘀蜀蠀褀言謀谀贀踀輀退鄀鈀錀鐀' +
        '销阀需頀餀騀鬀鰀鴀鸀ꄀꈀꌀꔀ𐘀𒀀' +
        '𒄀𒈀𓀀𓄀𓈀𓌀𔐀𔔀𖠀𖤀𠀀𠄀𠈀𠌀𠐀𠔀' +
        '𠘀𠜀𠠀𠤀𠨀𠬀𠰀𠴀𠸀𠼀𡀀𡄀𡈀𡌀𡐀𡔀' +
        '𡘀𡜀𡠀𡤀𡨀𡬀𡰀𡴀𡸀𡼀𢀀𢄀𢈀𢌀𢐀𢔀' +
        '𢘀𢜀𢠀𢤀𢨀𢬀𢰀𢴀𢸀𢼀𣀀𣄀𣈀𣌀𣐀𣔀' +
        '𣘀𣜀𣠀𣤀𣨀𣬀𣰀𣴀𣸀𣼀𤀀𤄀𤈀𤌀𤐀𤔀' +
        '𤘀𤜀𤠀𤤀𤨀𤬀𤰀𤴀𤸀𤼀𥀀𥄀𥈀𥌀𥐀𥔀' +
        '𥘀𥜀𥠀𥤀𥨀𥬀𥰀𥴀𥸀𥼀𦀀𦄀𦈀𦌀𦐀𦔀' +
        '𦘀𦜀𦠀𦤀𦨀𦬀𦰀𦴀𦸀𦼀𧀀𧄀𧈀𧌀𧐀𧔀' +
        '𧘀𧜀𧠀𧤀𧨀𧬀𧰀𧴀𧸀𧼀𨀀𨄀𨈀𨌀𨐀𨔀'
      )

      // Check East_Asian_Width properties. Each block of 256 characters
      // has the same East_Asian_Width property. 243 of the blocks are 'W' (wide),
      // the other 13 + 1 are 'N' (neutral, which in effect is narrow).
      // This is significant when considering rendering and wrapping.
      const allBlockStarts = [...blockStarts].map(x => x.codePointAt(0))
      const neutralBlockStarts = [...'ᔀꔀ𐘀𒀀𒄀𒈀𓀀𓄀𓈀𓌀𔐀𔔀𖠀𖤀'].map(x => x.codePointAt(0))
      allBlockStarts.forEach(blockStart => {
        for (let i = 0; i < 1 << 8; i++) {
          const codePoint = blockStart + i
          const isInNeutralBlock = neutralBlockStarts
            .some(neutralBlockStart => neutralBlockStart <= codePoint && codePoint < neutralBlockStart + (1 << 8))
          expect(scp8.eastAsianWidth(codePoint)).toBe(isInNeutralBlock ? 'N' : 'W')
        }
      })
    })
  })

  describe('base32768', () => {
    it('works', () => {
      const safeRange = function (min, max) {
        for (let codePoint = min; codePoint < max; codePoint++) {
          if (!scp9(codePoint)) {
            return false
          }
        }
        return true
      }

      const getAllSafeRanges = rangeSize => {
        const allSafeRanges = []
        for (let codePoint = 0; codePoint < (1 << 16) + (1 << 20); codePoint += rangeSize) {
          if (safeRange(codePoint, codePoint + rangeSize)) {
            allSafeRanges.push(codePoint)
          }
        }
        return allSafeRanges
      }

      const rangeSize = 5
      const allSafeRanges = getAllSafeRanges(1 << rangeSize)

      const repertoireSizes = []
      for (let i = 15; i > 0; i -= 8) { // Base32768 is a 15-bit encoding of 8-bit binary data
        repertoireSizes.unshift(i - rangeSize)
      }

      const repertoireOffsets = repertoireSizes
        .map(x => 1 << x)
        .map((x, i, arr) => x + (i === 0 ? 0 : arr[i - 1])) // cumulative sum
        .map((offset, i, arr) => allSafeRanges
          .slice(i === 0 ? 0 : arr[i - 1], arr[i])
          .map(x => String.fromCodePoint(x))
          .join('')
        )
        .reverse()

      expect(repertoireOffsets).toEqual([
        'ҠԀڀڠݠހ߀ကႠᄀᄠᅀᆀᇠሀሠበዠጠᎠᏀᐠᑀᑠᒀᒠᓀᓠᔀᔠᕀᕠᖀᖠᗀᗠᘀᘠᙀᚠᛀកᠠᡀᣀᦀ᧠ᨠᯀᰀᴀ⇠⋀⍀⍠⎀⎠⏀␀─┠╀╠▀■◀◠☀☠♀♠⚀⚠⛀⛠✀✠❀➀➠⠀⠠⡀⡠⢀⢠⣀⣠⤀⤠⥀⥠⦠⨠⩀⪀⪠⫠⬀⬠⭀ⰀⲀⲠⳀⴀⵀ⺠⻀㇀㐀㐠㑀㑠㒀㒠㓀㓠㔀㔠㕀㕠㖀㖠㗀㗠㘀㘠㙀㙠㚀㚠㛀㛠㜀㜠㝀㝠㞀㞠㟀㟠㠀㠠㡀㡠㢀㢠㣀㣠㤀㤠㥀㥠㦀㦠㧀㧠㨀㨠㩀㩠㪀㪠㫀㫠㬀㬠㭀㭠㮀㮠㯀㯠㰀㰠㱀㱠㲀㲠㳀㳠㴀㴠㵀㵠㶀㶠㷀㷠㸀㸠㹀㹠㺀㺠㻀㻠㼀㼠㽀㽠㾀㾠㿀㿠䀀䀠䁀䁠䂀䂠䃀䃠䄀䄠䅀䅠䆀䆠䇀䇠䈀䈠䉀䉠䊀䊠䋀䋠䌀䌠䍀䍠䎀䎠䏀䏠䐀䐠䑀䑠䒀䒠䓀䓠䔀䔠䕀䕠䖀䖠䗀䗠䘀䘠䙀䙠䚀䚠䛀䛠䜀䜠䝀䝠䞀䞠䟀䟠䠀䠠䡀䡠䢀䢠䣀䣠䤀䤠䥀䥠䦀䦠䧀䧠䨀䨠䩀䩠䪀䪠䫀䫠䬀䬠䭀䭠䮀䮠䯀䯠䰀䰠䱀䱠䲀䲠䳀䳠䴀䴠䵀䵠䶀䷀䷠一丠乀习亀亠什仠伀传佀你侀侠俀俠倀倠偀偠傀傠僀僠儀儠兀兠冀冠净几刀删剀剠劀加勀勠匀匠區占厀厠叀叠吀吠呀呠咀咠哀哠唀唠啀啠喀喠嗀嗠嘀嘠噀噠嚀嚠囀因圀圠址坠垀垠埀埠堀堠塀塠墀墠壀壠夀夠奀奠妀妠姀姠娀娠婀婠媀媠嫀嫠嬀嬠孀孠宀宠寀寠尀尠局屠岀岠峀峠崀崠嵀嵠嶀嶠巀巠帀帠幀幠庀庠廀廠开张彀彠往徠忀忠怀怠恀恠悀悠惀惠愀愠慀慠憀憠懀懠戀戠所扠技抠拀拠挀挠捀捠掀掠揀揠搀搠摀摠撀撠擀擠攀攠敀敠斀斠旀无昀映晀晠暀暠曀曠最朠杀杠枀枠柀柠栀栠桀桠梀梠检棠椀椠楀楠榀榠槀槠樀樠橀橠檀檠櫀櫠欀欠歀歠殀殠毀毠氀氠汀池沀沠泀泠洀洠浀浠涀涠淀淠渀渠湀湠満溠滀滠漀漠潀潠澀澠激濠瀀瀠灀灠炀炠烀烠焀焠煀煠熀熠燀燠爀爠牀牠犀犠狀狠猀猠獀獠玀玠珀珠琀琠瑀瑠璀璠瓀瓠甀甠畀畠疀疠痀痠瘀瘠癀癠皀皠盀盠眀眠着睠瞀瞠矀矠砀砠础硠碀碠磀磠礀礠祀祠禀禠秀秠稀稠穀穠窀窠竀章笀笠筀筠简箠節篠簀簠籀籠粀粠糀糠紀素絀絠綀綠緀締縀縠繀繠纀纠绀绠缀缠罀罠羀羠翀翠耀耠聀聠肀肠胀胠脀脠腀腠膀膠臀臠舀舠艀艠芀芠苀苠茀茠荀荠莀莠菀菠萀萠葀葠蒀蒠蓀蓠蔀蔠蕀蕠薀薠藀藠蘀蘠虀虠蚀蚠蛀蛠蜀蜠蝀蝠螀螠蟀蟠蠀蠠血衠袀袠裀裠褀褠襀襠覀覠觀觠言訠詀詠誀誠諀諠謀謠譀譠讀讠诀诠谀谠豀豠貀負賀賠贀贠赀赠趀趠跀跠踀踠蹀蹠躀躠軀軠輀輠轀轠辀辠迀迠退造遀遠邀邠郀郠鄀鄠酀酠醀醠釀釠鈀鈠鉀鉠銀銠鋀鋠錀錠鍀鍠鎀鎠鏀鏠鐀鐠鑀鑠钀钠铀铠销锠镀镠門閠闀闠阀阠陀陠隀隠雀雠需霠靀靠鞀鞠韀韠頀頠顀顠颀颠飀飠餀餠饀饠馀馠駀駠騀騠驀驠骀骠髀髠鬀鬠魀魠鮀鮠鯀鯠鰀鰠鱀鱠鲀鲠鳀鳠鴀鴠鵀鵠鶀鶠鷀鷠鸀鸠鹀鹠麀麠黀黠鼀鼠齀齠龀龠ꀀꀠꁀꁠꂀꂠꃀꃠꄀꄠꅀꅠꆀꆠꇀꇠꈀꈠꉀꉠꊀꊠꋀꋠꌀꌠꍀꍠꎀꎠꏀꏠꐀꐠꑀꑠ꒠ꔀꔠꕀꕠꖀꖠꗀꗠꙀꚠꛀ꜀꜠ꝀꞀꡀ',
        'ƀɀɠʀ'
      ])
    })
  })

  describe('base2048', () => {
    it('works', () => {
      const repertoireSizes = []
      for (let i = 11; i > 0; i -= 8) { // Base2048 is an 11-bit encoding of 8-bit binary data
        repertoireSizes.unshift(1 << i)
      }

      let codePoint = 0
      const repertoires = repertoireSizes
        .map(repertoireSize => {
          const codePoints = []
          while (codePoints.length < repertoireSize) {
            if (
              scp10(codePoint) &&
              !scp10.generalCategory(codePoint).startsWith('S') &&
              scp10.generalCategory(codePoint) !== 'Lm'
            ) {
              codePoints.push(codePoint)
            }
            codePoint++
          }
          return codePoints
        })
        .map(codePoints => codePoints.map(x => String.fromCodePoint(x)).join(''))
        .reverse()

      expect(repertoires).toEqual([
        '89ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÆÐØÞßæðøþĐđĦħıĸŁłŊŋŒœŦŧƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟƢƣƤƥƦƧƨƩƪƫƬƭƮƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿǀǁǂǃǝǤǥǶǷȜȝȠȡȢȣȤȥȴȵȶȷȸȹȺȻȼȽȾȿɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯͰͱͲͳͶͷͻͼͽͿΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρςστυφχψωϏϗϘϙϚϛϜϝϞϟϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯϳϷϸϺϻϼϽϾϿЂЄЅІЈЉЊЋЏАБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзиклмнопрстуфхцчшщъыьэюяђєѕіјљњћџѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯѰѱѲѳѴѵѸѹѺѻѼѽѾѿҀҁҊҋҌҍҎҏҐґҒғҔҕҖҗҘҙҚқҜҝҞҟҠҡҢңҤҥҦҧҨҩҪҫҬҭҮүҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿӀӃӄӅӆӇӈӉӊӋӌӍӎӏӔӕӘәӠӡӨөӶӷӺӻӼӽӾӿԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏԐԑԒԓԔԕԖԗԘԙԚԛԜԝԞԟԠԡԢԣԤԥԦԧԨԩԪԫԬԭԮԯԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏՐՑՒՓՔՕՖաբգդեզէըթժիլխծկհձղճմյնշոչպջռսվտրցւփքօֆאבגדהוזחטיךכלםמןנסעףפץצקרשתװױײؠءابةتثجحخدذرزسشصضطظعغػؼؽؾؿفقكلمنهوىي٠١٢٣٤٥٦٧٨٩ٮٯٱٲٳٴٹٺٻټٽپٿڀځڂڃڄڅچڇڈډڊڋڌڍڎڏڐڑڒړڔڕږڗژڙښڛڜڝڞڟڠڡڢڣڤڥڦڧڨکڪګڬڭڮگڰڱڲڳڴڵڶڷڸڹںڻڼڽھڿہۃۄۅۆۇۈۉۊۋیۍێۏېۑےەۮۯ۰۱۲۳۴۵۶۷۸۹ۺۻۼۿܐܒܓܔܕܖܗܘܙܚܛܜܝܞܟܠܡܢܣܤܥܦܧܨܩܪܫܬܭܮܯݍݎݏݐݑݒݓݔݕݖݗݘݙݚݛݜݝݞݟݠݡݢݣݤݥݦݧݨݩݪݫݬݭݮݯݰݱݲݳݴݵݶݷݸݹݺݻݼݽݾݿހށނރބޅކއވމފދތލގޏސޑޒޓޔޕޖޗޘޙޚޛޜޝޞޟޠޡޢޣޤޥޱ߀߁߂߃߄߅߆߇߈߉ߊߋߌߍߎߏߐߑߒߓߔߕߖߗߘߙߚߛߜߝߞߟߠߡߢߣߤߥߦߧߨߩߪࠀࠁࠂࠃࠄࠅࠆࠇࠈࠉࠊࠋࠌࠍࠎࠏࠐࠑࠒࠓࠔࠕࡀࡁࡂࡃࡄࡅࡆࡇࡈࡉࡊࡋࡌࡍࡎࡏࡐࡑࡒࡓࡔࡕࡖࡗࡘࡠࡡࡢࡣࡤࡥࡦࡧࡨࡩࡪࢠࢡࢢࢣࢤࢥࢦࢧࢨࢩࢪࢫࢬࢭࢮࢯࢰࢱࢲࢳࢴࢶࢷࢸࢹࢺࢻࢼࢽऄअआइईउऊऋऌऍऎएऐऑऒओऔकखगघङचछजझञटठडढणतथदधनपफबभमयरलळवशषसहऽॐॠॡ०१२३४५६७८९ॲॳॴॵॶॷॸॹॺॻॼॽॾॿঀঅআইঈউঊঋঌএঐওঔকখগঘঙচছজঝঞটঠডঢণতথদধনপফবভমযরলশষসহঽৎৠৡ০১২৩৪৫৬৭৮৯ৰৱ৴৵৶৷৸৹ৼਅਆਇਈਉਊਏਐਓਔਕਖਗਘਙਚਛਜਝਞਟਠਡਢਣਤਥਦਧਨਪਫਬਭਮਯਰਲਵਸਹੜ੦੧੨੩੪੫੬੭੮੯ੲੳੴઅઆઇઈઉઊઋઌઍએઐઑઓઔકખગઘઙચછજઝઞટઠડઢણતથદધનપફબભમયરલળવશષસહઽૐૠૡ૦૧૨૩૪૫૬૭૮૯ૹଅଆଇଈଉଊଋଌଏଐଓଔକଖଗଘଙଚଛଜଝଞଟଠଡଢଣତଥଦଧନପଫବଭମଯରଲଳଵଶଷସହଽୟୠୡ୦୧୨୩୪୫୬୭୮୯ୱ୲୳୴୵୶୷ஃஅஆஇஈஉஊஎஏஐஒஓகஙசஜஞடணதநனபமயரறலளழவஶஷஸஹௐ௦௧௨௩௪௫௬௭௮௯௰௱௲అఆఇఈఉఊఋఌఎఏఐఒఓఔకఖగఘఙచఛజఝఞటఠడఢణతథదధనపఫబభమయరఱలళఴవశషసహఽౘౙౚౠౡ౦౧౨౩౪౫౬౭౮౯౸౹౺౻౼౽౾ಀಅಆಇಈಉಊಋಌಎಏಐಒಓಔಕಖಗಘಙಚಛಜಝಞಟಠಡಢಣತಥದಧನಪಫಬಭಮಯರಱಲಳವಶಷಸಹಽೞೠೡ೦೧೨೩೪೫೬೭೮೯ೱೲഅആഇഈഉഊഋഌഎഏഐഒഓഔകഖഗഘങചഛജഝഞടഠഡഢണതഥദധനഩപഫബഭമയരറലളഴവശഷസഹഺഽൎൔൕൖ൘൙൚൛൜൝൞ൟൠൡ൦൧൨൩൪൫൬൭൮൯൰൱൲൳൴൵൶൷൸ൺൻർൽൾൿඅආඇඈඉඊඋඌඍඎඏඐඑඒඓඔඕඖකඛගඝඞඟචඡජඣඤඥඦටඨඩඪණඬතථදධනඳපඵබභමඹයරලවශෂසහළෆ෦෧෨෩෪෫෬෭෮෯กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะาเแโใไๅ๐๑๒๓๔๕๖๗๘๙ກຂຄງຈຊຍດຕຖທນບປຜຝພຟມຢຣລວສຫອຮຯະາຽເແໂໃໄ໐໑໒໓໔໕໖໗໘໙ໞໟༀ༠༡༢༣༤༥༦༧༨༩༪༫༬༭༮༯༰༱༲༳ཀཁགངཅཆཇཉཊཋཌཎཏཐདནཔཕབམཙཚཛཝཞཟའཡརལཤཥསཧཨཪཫཬྈྉྊྋྌကခဂဃငစဆဇဈဉညဋဌဍဎဏတထဒဓနပဖဗဘမယရလဝသဟဠအဢဣဤဥဧဨဩဪဿ၀၁၂၃၄၅၆၇၈၉ၐၑၒၓၔၕ',
        '01234567'
      ])
    })
  })

  describe('base2e15', () => {
    it('is not safe', () => {
      const repertoires = [
        [0x3480, 0x4DB6],
        [0x4E00, 0x8926],
        [0xAC00, 0xD7A4],
        [0x3400, 0x3480]
      ]
      const badGc = []
      const badCcc = []
      const badNfdQc = []
      const badNfkdQc = []
      repertoires.forEach(repertoire => {
        for (let i = repertoire[0]; i < repertoire[1]; i++) {
          if (scp10.generalCategory(i) !== 'Lo') {
            badGc.push(i)
          }
          if (scp10.canonicalCombiningClass(i) !== 0) {
            badCcc.push(i)
          }
          if (scp10.normalizationProperties(i, 'NFD_QC') !== 'Y') {
            badNfdQc.push(i)
          }
          if (scp10.normalizationProperties(i, 'NFKD_QC') !== 'Y') {
            badNfkdQc.push(i)
          }
        }
      })
      expect(badGc).toEqual([])
      expect(badCcc).toEqual([])
      expect(badNfdQc.length).toBe(11172)
      expect(badNfkdQc.length).toBe(11172)
    })
  })

  describe('base32k', () => {
    it('is not safe', () => {
      const lanes = [
        [0x4000, 0xA000],
        [0xB000, 0xD000]
      ]
      const badNfdQc = []
      const badNfkdQc = []
      lanes.forEach(lane => {
        for (let i = lane[0]; i < lane[1]; i++) {
          if (scp10.normalizationProperties(i, 'NFD_QC') !== 'Y') {
            badNfdQc.push(i)
          }
          if (scp10.normalizationProperties(i, 'NFKD_QC') !== 'Y') {
            badNfkdQc.push(i)
          }
        }
      })
      expect(badNfdQc.length).toBe(8192)
      expect(badNfkdQc.length).toBe(8192)
    })
  })

  describe('14', () => {
    it('works', async () => {
      const scp14 = await SafeCodePoint('14.0.0')
      const numCodePoints = (1 << 16) + (1 << 20)
      let numAssigned = 0
      let numSafe = 0
      let numSafeLetter = 0
      let numSafeLetterOther = 0
      for (let codePoint = 0; codePoint < numCodePoints; codePoint++) {
        const gc = scp14.generalCategory(codePoint)
        if (gc !== 'Cn') {
          numAssigned++
          if (scp14(codePoint)) {
            numSafe++
            if (gc.startsWith('L')) {
              numSafeLetter++
              if (gc === 'Lo') {
                numSafeLetterOther++
              }
            }
          }
        }
      }
      expect(numAssigned).toBe(284278)
      expect(numSafe).toBe(124456)
      expect(numSafeLetter).toBe(116231)
      expect(numSafeLetterOther).toBe(113876)
    })
  })

  describe('safeCategories', () => {
    it('works', async () => {
      const scp17WithNothingSafe = await SafeCodePoint('17.0.0', { safeCategories: {} })
      const scp17WithEverythingSafe = await SafeCodePoint('17.0.0', { safeCategories: new Proxy({}, { get (_, prop) { return true } }) })

      const numSafeCodePoints17 = getNumSafeCodePoints(scp17)
      const numSafeCodePoints17WithNothingSafe = getNumSafeCodePoints(scp17WithNothingSafe)
      const numSafeCodePoints17WithEverythingSafe = getNumSafeCodePoints(scp17WithEverythingSafe)

      expect(numSafeCodePoints17WithNothingSafe).toBeLessThan(numSafeCodePoints17)
      expect(numSafeCodePoints17).toBeLessThan(numSafeCodePoints17WithEverythingSafe)
    })
  })
})
