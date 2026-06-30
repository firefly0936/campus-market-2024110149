/**
 * 内容违规检测工具
 *
 * 用于在发布内容前进行违规判断，涵盖：
 * - 违法违禁词（直接拦截）
 * - 校园违规词（直接拦截）
 * - 不良信息（直接拦截）
 * - 隐私风险（警告提示）
 * - 广告引流（警告提示）
 */

// ═══════════════════════════════════════════
// 类型定义
// ═══════════════════════════════════════════

/** 违规严重程度 */
export type ViolationSeverity = 'block' | 'warning'

/** 违规类别 */
export type ViolationCategory =
  | '违法违禁'
  | '校园违规'
  | '不良信息'
  | '隐私风险'
  | '广告引流'

/** 单条违规记录 */
export interface Violation {
  /** 命中的违规词/模式 */
  word: string
  /** 违规原因说明 */
  reason: string
  /** 严重程度：block = 直接拦截, warning = 警告但可继续 */
  severity: ViolationSeverity
  /** 违规类别 */
  category: ViolationCategory
}

/** 单字段检测结果 */
export interface FieldCheckResult {
  /** 字段名 */
  field: string
  /** 该字段中的违规列表 */
  violations: Violation[]
}

/** 整体检测结果 */
export interface FilterResult {
  /** 是否通过（无 block 级别违规） */
  passed: boolean
  /** 各字段的违规详情 */
  fields: FieldCheckResult[]
  /** 所有 block 级别违规汇总 */
  blocks: Violation[]
  /** 所有 warning 级别违规汇总 */
  warnings: Violation[]
}

// ═══════════════════════════════════════════
// 违规词库
// ═══════════════════════════════════════════

interface WordEntry {
  /** 匹配关键词 */
  keyword: string
  /** 违规原因 */
  reason: string
  /** 违规类别 */
  category: ViolationCategory
}

/** 拦截级违规词（block） */
const BLOCK_WORDS: WordEntry[] = [
  // ── 违法物品 ──
  { keyword: '毒品', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '大麻', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '海洛因', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '冰毒', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '摇头丸', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: 'K粉', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '笑气', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '枪支', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '弹药', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '管制刀具', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '迷药', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '假钞', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '假币', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '窃听器', reason: '禁止发布违禁品信息', category: '违法违禁' },
  { keyword: '针孔摄像头', reason: '禁止发布违禁品信息', category: '违法违禁' },

  // ── 赌博相关 ──
  { keyword: '赌博', reason: '禁止发布赌博相关信息', category: '违法违禁' },
  { keyword: '赌场', reason: '禁止发布赌博相关信息', category: '违法违禁' },
  { keyword: '赌资', reason: '禁止发布赌博相关信息', category: '违法违禁' },
  { keyword: '网赌', reason: '禁止发布赌博相关信息', category: '违法违禁' },
  { keyword: '博彩', reason: '禁止发布赌博相关信息', category: '违法违禁' },
  { keyword: '六合彩', reason: '禁止发布赌博相关信息', category: '违法违禁' },
  { keyword: '时时彩', reason: '禁止发布赌博相关信息', category: '违法违禁' },

  // ── 诈骗/传销 ──
  { keyword: '传销', reason: '禁止发布传销相关信息', category: '违法违禁' },
  { keyword: '诈骗', reason: '禁止发布诈骗相关信息', category: '违法违禁' },
  { keyword: '套路贷', reason: '禁止发布非法借贷信息', category: '违法违禁' },
  { keyword: '校园贷', reason: '禁止发布非法借贷信息', category: '违法违禁' },
  { keyword: '裸贷', reason: '禁止发布非法借贷信息', category: '违法违禁' },
  { keyword: '刷单', reason: '禁止发布刷单相关信息', category: '违法违禁' },
  { keyword: '兼职刷单', reason: '禁止发布刷单相关信息', category: '违法违禁' },
  { keyword: '日赚', reason: '疑似虚假兼职/诈骗信息', category: '违法违禁' },
  { keyword: '高薪兼职', reason: '疑似虚假兼职/诈骗信息', category: '违法违禁' },

  // ── 学术违规 ──
  { keyword: '代考', reason: '禁止发布替考/代考信息', category: '校园违规' },
  { keyword: '替考', reason: '禁止发布替考/代考信息', category: '校园违规' },
  { keyword: '代写', reason: '禁止发布代写论文/作业信息', category: '校园违规' },
  { keyword: '论文代写', reason: '禁止发布代写论文/作业信息', category: '校园违规' },
  { keyword: '代做毕设', reason: '禁止发布代做毕设信息', category: '校园违规' },
  { keyword: '代课', reason: '禁止发布代课信息', category: '校园违规' },
  { keyword: '代签到', reason: '禁止发布代签到信息', category: '校园违规' },
  { keyword: '四六级答案', reason: '禁止发布考试作弊信息', category: '校园违规' },
  { keyword: '考试答案', reason: '禁止发布考试作弊信息', category: '校园违规' },

  // ── 色情/不良内容 ──
  { keyword: '色情', reason: '禁止发布色情相关信息', category: '不良信息' },
  { keyword: '约炮', reason: '禁止发布不当交友信息', category: '不良信息' },
  { keyword: '嫖娼', reason: '禁止发布违法信息', category: '不良信息' },
  { keyword: '一夜情', reason: '禁止发布不当交友信息', category: '不良信息' },
  { keyword: '上门服务', reason: '疑似违规服务信息', category: '不良信息' },

  // ── 辱骂/暴力 ──
  { keyword: '傻逼', reason: '包含不文明用语', category: '不良信息' },
  { keyword: '他妈的', reason: '包含不文明用语', category: '不良信息' },
  { keyword: '操你', reason: '包含不文明用语', category: '不良信息' },
  { keyword: '滚蛋', reason: '包含不文明用语', category: '不良信息' },
  { keyword: '去死', reason: '包含不当言论', category: '不良信息' },
  { keyword: '弄死你', reason: '包含暴力威胁言论', category: '不良信息' },
  { keyword: '砍死', reason: '包含暴力威胁言论', category: '不良信息' },
]

/** 警告级违规词（warning） */
const WARNING_WORDS: WordEntry[] = [
  { keyword: '加微信', reason: '请勿在内容中直接留联系方式，建议使用平台内聊天功能', category: '隐私风险' },
  { keyword: '加我微信', reason: '请勿在内容中直接留联系方式，建议使用平台内聊天功能', category: '隐私风险' },
  { keyword: '微信号', reason: '请勿在内容中直接留联系方式', category: '隐私风险' },
  { keyword: 'QQ号', reason: '请勿在内容中直接留联系方式', category: '隐私风险' },
  { keyword: '加Q', reason: '请勿在内容中直接留联系方式', category: '隐私风险' },
  { keyword: '扫码加', reason: '请勿在内容中直接留联系方式', category: '隐私风险' },
  { keyword: '代购', reason: '请确认是否为个人闲置交易，商业代购请谨慎', category: '广告引流' },
  { keyword: '加群', reason: '请勿发布引流加群信息', category: '广告引流' },
  { keyword: '关注公众号', reason: '请勿发布广告引流信息', category: '广告引流' },
]

// ═══════════════════════════════════════════
// 正则模式检测
// ═══════════════════════════════════════════

interface PatternEntry {
  /** 正则表达式 */
  pattern: RegExp
  /** 命中后的原因说明 */
  reason: string
  /** 违规类别 */
  category: ViolationCategory
  /** 严重程度 */
  severity: ViolationSeverity
}

const PATTERNS: PatternEntry[] = [
  // 手机号（中国内地）
  {
    pattern: /1[3-9]\d{9}/g,
    reason: '内容中包含手机号码，存在隐私泄露风险',
    category: '隐私风险',
    severity: 'warning',
  },
  // 身份证号（18 位）
  {
    pattern: /\d{6}(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]/g,
    reason: '内容中包含身份证号码，存在隐私泄露风险',
    category: '隐私风险',
    severity: 'warning',
  },
  // 银行卡号（16-19 位数字）
  {
    pattern: /\b\d{16,19}\b/g,
    reason: '内容中可能包含银行卡号，存在隐私泄露风险',
    category: '隐私风险',
    severity: 'warning',
  },
  // 外部 URL
  {
    pattern: /https?:\/\/[^\s]+/g,
    reason: '内容中包含外部链接，请注意核实来源',
    category: '广告引流',
    severity: 'warning',
  },
]

// ═══════════════════════════════════════════
// 检测函数
// ═══════════════════════════════════════════

/**
 * 对单个文本进行违规词检测
 */
function checkText(text: string): Violation[] {
  const violations: Violation[] = []
  const lowerText = text.toLowerCase()

  // 1. 检测 block 级别关键词
  for (const entry of BLOCK_WORDS) {
    if (lowerText.includes(entry.keyword.toLowerCase())) {
      // 避免重复添加同一违规词
      if (!violations.some((v) => v.word === entry.keyword)) {
        violations.push({
          word: entry.keyword,
          reason: entry.reason,
          severity: 'block',
          category: entry.category,
        })
      }
    }
  }

  // 2. 检测 warning 级别关键词
  for (const entry of WARNING_WORDS) {
    if (lowerText.includes(entry.keyword.toLowerCase())) {
      if (!violations.some((v) => v.word === entry.keyword)) {
        violations.push({
          word: entry.keyword,
          reason: entry.reason,
          severity: 'warning',
          category: entry.category,
        })
      }
    }
  }

  // 3. 正则模式检测
  for (const entry of PATTERNS) {
    // 重置 lastIndex（因为使用了 g 标志）
    const pattern = new RegExp(entry.pattern.source, entry.pattern.flags)
    const matches = text.match(pattern)
    if (matches && matches.length > 0) {
      for (const match of matches) {
        // 用脱敏后的匹配文本作为 word
        const masked = maskSensitive(match)
        if (!violations.some((v) => v.word === masked)) {
          violations.push({
            word: masked,
            reason: entry.reason,
            severity: entry.severity,
            category: entry.category,
          })
        }
      }
    }
  }

  return violations
}

/**
 * 对敏感内容进行脱敏显示
 */
function maskSensitive(text: string): string {
  // 手机号脱敏：138****5678
  if (/^1[3-9]\d{9}$/.test(text)) {
    return text.slice(0, 3) + '****' + text.slice(7)
  }
  // 身份证脱敏：3301**********1234
  if (/^\d{17}[\dXx]$/.test(text)) {
    return text.slice(0, 4) + '**********' + text.slice(-4)
  }
  // 银行卡脱敏：6222****1234
  if (/^\d{16,19}$/.test(text)) {
    return text.slice(0, 4) + '****' + text.slice(-4)
  }
  return text
}

/**
 * 对内容进行违规检测
 *
 * @param fields - 要检测的字段，key 为字段名（用于提示），value 为文本内容
 * @returns FilterResult - 检测结果
 *
 * @example
 * ```ts
 * const result = checkContent({
 *   title: '出售二手手机',
 *   description: '九成新，价格面议'
 * })
 * if (!result.passed) {
 *   // 有 block 级别违规，应阻止发布
 *   console.log(result.blocks)
 * }
 * if (result.warnings.length > 0) {
 *   // 有 warning 级别提示，可让用户确认后继续
 *   console.log(result.warnings)
 * }
 * ```
 */
export function checkContent(fields: Record<string, string>): FilterResult {
  const fieldResults: FieldCheckResult[] = []
  const allBlocks: Violation[] = []
  const allWarnings: Violation[] = []

  for (const [fieldName, text] of Object.entries(fields)) {
    if (!text || typeof text !== 'string') continue

    const violations = checkText(text)
    if (violations.length > 0) {
      fieldResults.push({
        field: fieldName,
        violations,
      })

      for (const v of violations) {
        if (v.severity === 'block') {
          allBlocks.push({ ...v })
        } else {
          allWarnings.push({ ...v })
        }
      }
    }
  }

  return {
    passed: allBlocks.length === 0,
    fields: fieldResults,
    blocks: allBlocks,
    warnings: allWarnings,
  }
}

/**
 * 获取可读的字段名映射
 */
const FIELD_LABEL_MAP: Record<string, string> = {
  title: '标题',
  description: '描述',
  location: '地点',
  tradeLocation: '交易地点',
  itemName: '物品名称',
  taskType: '任务类型',
  groupType: '拼单类型',
  from: '取件地点',
  to: '送达地点',
  meetingLocation: '集合地点',
  content: '消息内容',
}

/**
 * 获取字段的中文标签
 */
export function getFieldLabel(field: string): string {
  return FIELD_LABEL_MAP[field] || field
}
