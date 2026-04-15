import type {ToolContentDictionary} from "./tool-types";

export const toolContentJa: ToolContentDictionary = {
  "csv-excel-cleaner": {
    slug: "csv-excel-cleaner",
    title: "CSV / Excel クリーナー",
    category: "表データ整理と不要行削除",
    description:
      "CSV、TSV、Excel ファイルをブラウザで開き、空行削除、前後空白削除、完全重複行削除、空列削除、列選択をまとめて行い、サーバーへ送らずにそのままダウンロードできるローカル処理ツールです。",
    metadata: {
      title: "CSV / Excel クリーナー | 整理と変換の道具箱",
      description:
        "CSV、TSV、XLSX、XLS をブラウザ上で整形し、空行や重複行、余計な空白を整理して CSV または XLSX で出力できるローカル処理ツールです。",
      keywords: [
        "CSV クリーナー",
        "Excel クリーナー",
        "表計算 整形",
        "重複行 削除",
        "ローカル処理"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      "csv",
      "tsv",
      "xlsx",
      "xls"
    ],
    capabilities: [
      "CSV、TSV、XLSX、XLS を 1 ファイルずつブラウザで開ける",
      "Excel の場合は対象シートを選び、整形前後の表プレビューを見比べられる",
      "空行削除、前後空白削除、完全重複行削除、空列削除をまとめて実行できる",
      "必要な列だけを残して、CSV / TSV 形式または XLSX 形式で書き出せる"
    ],
    idealFor: [
      "顧客一覧、注文一覧、アンケート結果などの表データを提出前に整えたい人",
      "空行や重複行が混ざった CSV / Excel を短時間で見やすくしたい人",
      "本格的な表計算ソフトを開かずに、まず不要部分だけ素早く掃除したい人"
    ],
    steps: [
      {
        title: "ファイルを追加する",
        description:
          "CSV、TSV、XLSX、XLS のいずれか 1 ファイルを選ぶか、ドラッグ＆ドロップで取り込みます。"
      },
      {
        title: "シートと整形ルールを選ぶ",
        description:
          "Excel の場合は対象シートを選び、ヘッダー行の有無や整形ルールを切り替えます。"
      },
      {
        title: "件数とプレビューを確認する",
        description:
          "処理前後の行数・列数を見ながら、元データと整形後データのプレビューを確認します。"
      },
      {
        title: "整形後のファイルをダウンロードする",
        description:
          "結果に問題がなければ、CSV または XLSX として保存します。"
      }
    ],
    examples: [
      {
        title: "メーリングリストの空行と重複行を消す",
        before:
          "Name,Email\nAlice,alice@example.com\n\nBob,bob@example.com\nBob,bob@example.com",
        after:
          "Name,Email\nAlice,alice@example.com\nBob,bob@example.com",
        note:
          "途中の空行を削除し、完全に同じ内容の行を 1 行にまとめる例です。"
      },
      {
        title: "前後空白を整え、必要な列だけ残す",
        before:
          " Order ID , Customer , Notes , Internal Memo \n1001, A Corp , urgent , draft\n1002, B Corp, , keep inside team",
        after:
          "Order ID,Customer,Notes\n1001,A Corp,urgent\n1002,B Corp,",
        note:
          "セルの前後空白を削除し、引き渡しに不要な列を除いて出力する例です。"
      }
    ],
    cautions: [
      "出力されるのは整形後の値データです。元の Excel の書式、数式、結合セル、非表示シート設定などは維持されません。",
      "行数や列数が非常に多いファイルは、ブラウザ内での読み込みやプレビューに時間がかかることがあります。",
      "ヘッダー行の設定によって 1 行目の扱いが変わるため、ダウンロード前に確認してください。"
    ],
    faq: [
      {
        question: "表データはどこかにアップロードされますか？",
        answer:
          "いいえ。このツールはブラウザ内で読み込み、整形、出力を行う設計です。"
      },
      {
        question: "古い XLS ファイルも開けますか？",
        answer:
          "はい。基本的な XLS 読み込みに対応しています。ただし、古い文字コードや特殊な構造のファイルでは読み込みに失敗する場合があります。"
      },
      {
        question: "元の Excel の見た目や数式は残りますか？",
        answer:
          "いいえ。出力は整形後の表データを中心にしたものです。書式、数式、結合セル、ブック全体のレイアウトは維持されません。"
      }
    ],
    relatedTools: [
      {
        href: "/tools/text-cleanup",
        label: "文章整形ツール",
        description:
          "表データ整理のあとに、貼り付け用のメモや箇条書きも整えたいときに便利です。"
      },
      {
        href: "/tools/file-batch-rename",
        label: "ファイル一括リネーム",
        description:
          "整形後に書き出したファイル名も、共有前にわかりやすくそろえられます。"
      }
    ],
    relatedArticles: [
      {
        href: "/guide/clean-csv-empty-lines-duplicates",
        label: "CSVの空行や重複を消す方法",
        description:
          "空行、前後空白、重複行、列整理をどの順で進めると失敗しにくいかを先に確認できます。"
      },
      {
        href: "/guide",
        label: "使い方ガイド一覧",
        description:
          "整理・変換作業の進め方をまとめたガイドを一覧で確認できます。"
      },
      {
        href: "/faq",
        label: "よくある質問",
        description:
          "入力データの扱い方や対応形式、使い方の疑問を確認できます。"
      }
    ],
    history: [
      {
        date: "2026-04-14",
        summary:
          "CSV / Excel クリーナーを追加し、ローカル読み込み、シート選択、整形前後プレビューに対応しました。"
      },
      {
        date: "2026-04-14",
        summary:
          "空行削除、前後空白削除、重複行削除、空列削除、列選択、CSV / XLSX 出力を追加しました。"
      }
    ],
    operation: {
      kind: "tabularCleaner",
      ui: {
        title: "ファイル設定と整形ルール",
        description:
          "左側でファイル、シート、整形ルールを設定し、右側で件数とプレビューを見ながら整形結果を確認できます。",
        actions: {
          clearColumnSelectionLabel: "選択解除",
          downloadLabel: "整形後ファイルをダウンロード",
          downloadingLabel: "ファイルを準備中...",
          resetLabel: "リセット",
          selectAllColumnsLabel: "すべて選択"
        },
        dropzone: {
          title: "CSV / Excel ファイル",
          description:
            "CSV、TSV、XLSX、XLS のいずれか 1 ファイルを選ぶか、ここへドラッグ＆ドロップしてください。",
          browseLabel: "ファイルを選ぶ",
          activeLabel: "ここにファイルをドロップ",
          hint:
            "ファイルはブラウザ内で処理されます。読み込み、プレビュー、書き出しはローカルで完結します。"
        },
        emptyState: {
          title: "まだファイルが選ばれていません",
          description:
            "CSV または Excel ファイルを追加すると、ここに件数と表プレビューが表示されます。"
        },
        fields: {
          columnsHint:
            "出力に残したい列だけを選んでください。",
          columnsLabel: "残す列",
          hasHeaderRowLabel: "1 行目をヘッダー行として扱う",
          nonEmptyCountLabel: "空でない値",
          outputFormatLabel: "出力形式",
          outputFormatOptions: {
            csv: "CSV / TSV テキスト",
            xlsx: "XLSX"
          },
          removeDuplicateRowsLabel: "完全に同じ行を削除する",
          removeEmptyColumnsLabel: "空列を削除する",
          removeEmptyRowsLabel: "空行を削除する",
          sheetLabel: "シート",
          textDelimiterLabel: "テキスト出力の区切り形式",
          textDelimiterOptions: {
            comma: "CSV（カンマ区切り）",
            tab: "TSV（タブ区切り）"
          },
          trimCellWhitespaceLabel: "各セルの前後空白を削除する"
        },
        helper: {
          delimiterNote:
            "テキスト形式で出力する場合は、通常の CSV とタブ区切りの TSV を選べます。",
          headerNote:
            "1 行目が列名ならオンのまま使うと自然です。通常データならオフに切り替えてください。",
          localProcessingNote:
            "選択したファイルはブラウザ内で読み込みと整形を行います。AI 学習用に送信する仕組みは入れていません。"
        },
        preview: {
          cleanedTitle: "整形後プレビュー",
          emptyCellLabel: "空",
          originalTitle: "元データプレビュー",
          rowNumberLabel: "行",
          showingRowsLabel: "表示中の行数",
          title: "件数サマリーとプレビュー"
        },
        sections: {
          cleanupOptions: "整形オプション",
          outputSettings: "出力設定",
          sourceSettings: "入力設定",
          summary: "現在のサマリー"
        },
        summary: {
          afterColumnsLabel: "整形後の列数",
          afterRowsLabel: "整形後の行数",
          beforeColumnsLabel: "整形前の列数",
          beforeRowsLabel: "整形前の行数",
          detectedFormatLabel: "判定された形式",
          fileLabel: "選択中のファイル",
          removedDuplicateRowsLabel: "削除した重複行数",
          removedEmptyColumnsLabel: "削除した空列数",
          removedEmptyRowsLabel: "削除した空行数",
          selectedColumnsLabel: "出力対象の列数",
          sheetLabel: "作業中のシート"
        },
        status: {
          loading: "ファイルを読み込み中...",
          previewUpdating: "プレビューを更新中...",
          ready: "プレビューを確認できます"
        },
        validation: {
          abnormalData: "通常の表データとして解釈できない内容が含まれていました。",
          emptyFile: "選択したファイルが空のようです。",
          exportFailed: "整形後ファイルの作成に失敗しました。設定を確認してもう一度お試しください。",
          loadFailed: "ファイルの読み込みに失敗しました。",
          noColumnsSelected: "出力に含める列を 1 つ以上選んでください。",
          unsupportedFormat: "未対応の形式です。csv、tsv、xlsx、xls を選んでください。"
        }
      }
    }
  },
  "file-batch-rename": {
    slug: "file-batch-rename",
    title: "ファイル一括リネーム",
    category: "ファイル名整理と連番付与",
    description:
      "複数ファイルをまとめて選び、先頭追加・末尾追加・文字置換・連番付与のルールで新しい名前をプレビューし、そのまま ZIP で一括ダウンロードできるローカル処理ツールです。",
    metadata: {
      title: "ファイル一括リネーム | 整理と変換の道具箱",
      description:
        "複数ファイル名をローカルで一括変換し、連番付与や置換を確認して ZIP でまとめてダウンロードできるブラウザツールです。",
      keywords: [
        "ファイル一括リネーム",
        "ファイル名変更",
        "連番付与",
        "ローカル処理"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      "画像ファイル",
      "PDF / 文書 / 表計算ファイルなどの一般的なファイル",
      "複数選択またはドラッグ＆ドロップしたファイル一式"
    ],
    capabilities: [
      "複数ファイルをまとめて追加し、ドラッグ＆ドロップでも取り込める",
      "先頭追加、末尾追加、一部文字列の置換、連番付与を組み合わせられる",
      "ファイル名順や追加順でプレビュー順を切り替え、連番の振り方を調整できる",
      "拡張子を維持したまま、新しい名前を一覧プレビューできる",
      "空名、重複名、不正文字の簡易チェックをしてから ZIP で一括ダウンロードできる"
    ],
    idealFor: [
      "撮影データや添付資料の名前をまとめてそろえたい人",
      "提出前にファイル名へ案件名や日付を追加したい人",
      "共有フォルダへ入れる前に、連番や命名規則を整えたい人"
    ],
    steps: [
      {
        title: "対象ファイルを追加する",
        description:
          "複数ファイルを選択するか、ドラッグ＆ドロップでまとめて取り込みます。"
      },
      {
        title: "リネームルールを設定する",
        description:
          "先頭追加、末尾追加、文字置換、連番付与、置換時の大文字小文字、並び順を左側で調整します。"
      },
      {
        title: "プレビューと警告を確認する",
        description:
          "右側の一覧で元の名前と新しい名前を見比べ、重複や不正文字がないかを確認します。"
      },
      {
        title: "ZIP でまとめてダウンロードする",
        description:
          "問題がなければ、リネーム後のファイルを ZIP にまとめて保存します。"
      }
    ],
    examples: [
      {
        title: "写真ファイルへ案件名と連番を付ける",
        before: "IMG_8123.jpg\nIMG_8124.jpg\nIMG_8125.jpg",
        after: "2026-event-001.jpg\n2026-event-002.jpg\n2026-event-003.jpg",
        note:
          "先頭に `2026-event-` を追加し、3 桁の連番を先頭側へ付けた例です。"
      },
      {
        title: "提出前にファイル名の表記を置換する",
        before: "見積書_仮.pdf\n請求書_仮.pdf",
        after: "見積書_提出版.pdf\n請求書_提出版.pdf",
        note:
          "`仮` を `提出版` に置き換え、拡張子はそのまま維持します。"
      }
    ],
    cautions: [
      "元のローカルファイルを直接リネームするのではなく、新しい名前でまとめた ZIP を作成します。",
      "非常に大きいファイルや大量ファイルでは、ブラウザ側の処理と ZIP 作成に少し時間がかかることがあります。",
      "重複名や不正文字がある状態では、ZIP ダウンロード前にプレビュー上で修正してください。"
    ],
    faq: [
      {
        question: "ファイルはサーバーへ送信されますか？",
        answer:
          "いいえ。このツールはブラウザ内で処理し、ZIP 生成もローカルで行います。"
      },
      {
        question: "元のファイル名はパソコン上で直接変更されますか？",
        answer:
          "直接は変更しません。リネーム後のファイルを含む ZIP を新しくダウンロードする形です。"
      },
      {
        question: "拡張子は変わりますか？",
        answer:
          "拡張子は維持します。変わるのは基本的にファイル名本体だけです。"
      }
    ],
    relatedTools: [
      {
        href: "/tools/text-cleanup",
        label: "文章整理ツール",
        description:
          "ファイル名だけでなく、貼り付け文章の整形もローカルで行えます。"
      }
    ],
    relatedArticles: [
      {
        href: "/guide/rename-files-in-bulk",
        label: "ファイル名をまとめてそろえる方法",
        description:
          "接頭語、接尾語、連番をどう考えると見やすい名前になるかを先に確認できます。"
      },
      {
        href: "/guide",
        label: "使い方ガイド一覧",
        description:
          "整理・変換作業の進め方をまとめたガイドを一覧で確認できます。"
      },
      {
        href: "/faq",
        label: "よくある質問",
        description:
          "入力データの扱い方、対応形式、お問い合わせ先などをまとめています。"
      }
    ],
    history: [
      {
        date: "2026-04-15",
        summary:
          "プレビューの並び順切り替えと、大文字小文字を区別する置換設定を追加しました。"
      },
      {
        date: "2026-04-14",
        summary:
          "ファイル一括リネームツールを追加し、ZIP 一括ダウンロードまでブラウザ内で完結できるようにしました。"
      },
      {
        date: "2026-04-14",
        summary:
          "連番付与、先頭追加、末尾追加、文字置換、重複検知のプレビューを追加しました。"
      }
    ],
    operation: {
      kind: "fileBatchRename",
      ui: {
        title: "ファイル選択とリネーム設定",
        description:
          "左でファイルとルールを設定し、右で新しい名前を確認します。問題がなければ ZIP にまとめてダウンロードできます。",
        dropzone: {
          title: "対象ファイル",
          description:
            "複数ファイルを選択するか、ここへドラッグ＆ドロップしてください。",
          browseLabel: "ファイルを選ぶ",
          activeLabel: "ここにファイルをドロップ",
          hint:
            "ファイルはサーバーへ送信せず、ブラウザ内でリネームプレビューと ZIP 作成を行います。"
        },
        emptyState: {
          title: "まだファイルが選択されていません",
          description:
            "まずは複数ファイルを追加すると、ここにリネームプレビューが表示されます。"
        },
        fields: {
          caseSensitiveReplaceLabel: "置換時に大文字小文字を区別する",
          prefixLabel: "先頭に追加する文字",
          prefixPlaceholder: "例: project-",
          suffixLabel: "末尾に追加する文字",
          suffixPlaceholder: "例: -final",
          findLabel: "置換する文字列",
          findPlaceholder: "例: 仮",
          replaceLabel: "置換後の文字列",
          replacePlaceholder: "例: 提出版",
          sortOrderLabel: "プレビューと連番の並び順",
          sortOrderHint:
            "連番を付けるときは、この並び順に沿って番号が振られます。",
          sortOrderOptions: {
            added: "追加した順",
            nameAsc: "ファイル名 A→Z",
            nameDesc: "ファイル名 Z→A"
          },
          numberingLabel: "連番を付与する",
          numberingPositionLabel: "連番の位置",
          numberingPositionOptions: {
            prefix: "先頭に付与",
            suffix: "末尾に付与"
          },
          digitsLabel: "連番の桁数",
          digitsHint: "例: 3 桁なら 001, 002",
          startNumberLabel: "開始番号",
          startNumberHint: "例: 5 から始めると 005, 006"
        },
        helper: {
          extensionNote:
            "拡張子は自動で維持します。変わるのはファイル名本体だけです。",
          ruleOrder:
            "新しい名前は、置換 → 先頭/末尾文字の追加 → 連番付与 の順で組み立てます。連番は選んだ並び順に沿って付与されます。"
        },
        preview: {
          title: "リネームプレビュー",
          originalNameLabel: "元の名前",
          newNameLabel: "新しい名前",
          issuesLabel: "確認ポイント"
        },
        status: {
          ready: "準備OK",
          issue: "要確認"
        },
        summary: {
          selectedCountLabel: "選択中",
          readyCountLabel: "ダウンロード可能",
          issueCountLabel: "要修正"
        },
        actions: {
          downloadErrorLabel:
            "ZIP の作成に失敗しました。ブラウザを更新せず、ファイル数や名前設定を確認して再度お試しください。",
          downloadZipLabel: "ZIPで一括ダウンロード",
          downloadingZipLabel: "ZIPを作成中...",
          resetLabel: "リセット",
          zipFileName: "renamed-files-ja.zip"
        },
        validation: {
          emptyName: "ファイル名が空になります。",
          duplicateName: "同じ新しい名前が複数あります。",
          invalidCharacters: "使用できない文字が含まれています。",
          reservedName: "一部環境で使えない予約名です。"
        }
      }
    }
  },
  "image-batch-resize-webp": {
    slug: "image-batch-resize-webp",
    title: "画像一括リサイズ / WebP変換",
    category: "画像軽量化と形式変換",
    description:
      "複数画像をまとめて取り込み、幅や高さの調整、WebP 変換、品質設定をブラウザ内でまとめて行い、軽量化した画像を ZIP で一括ダウンロードできるローカル処理ツールです。",
    metadata: {
      title: "画像一括リサイズ / WebP変換 | 整理と変換の道具箱",
      description:
        "jpg / jpeg / png / webp をまとめてリサイズし、WebP 変換や品質調整をローカルで行って ZIP で保存できるブラウザツールです。",
      keywords: [
        "画像一括リサイズ",
        "WebP変換",
        "画像軽量化",
        "ローカル処理"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      "jpg / jpeg",
      "png",
      "webp",
      "複数画像のまとめアップロードとドラッグ＆ドロップ"
    ],
    capabilities: [
      "複数画像をまとめて追加し、ドラッグ＆ドロップでも取り込める",
      "幅指定、高さ指定、縦横比維持を組み合わせて一括リサイズできる",
      "元形式のまま出力するか、まとめて WebP へ変換できる",
      "品質、出力ファイル名ルール、Before / After 情報を確認したうえで ZIP で一括保存できる"
    ],
    idealFor: [
      "ブログやお知らせ用の画像を公開前に軽くしたい人",
      "EC 商品画像や資料添付画像をまとめて整えたい人",
      "画像編集ソフトを開かずに、複数画像を手早く整えたい人"
    ],
    steps: [
      {
        title: "画像をまとめて追加する",
        description:
          "jpg / jpeg / png / webp の画像を複数選択するか、ドラッグ＆ドロップで読み込みます。"
      },
      {
        title: "サイズ・形式・品質を設定する",
        description:
          "幅、高さ、縦横比維持、WebP 変換、品質、出力名の先頭 / 末尾を必要に応じて設定します。"
      },
      {
        title: "処理結果を確認する",
        description:
          "元サイズ、出力サイズ、概算の軽量化率を一覧で見比べ、エラーがないか確認します。"
      },
      {
        title: "ZIP でまとめて保存する",
        description:
          "問題がなければ、変換後の画像を ZIP で一括ダウンロードします。"
      }
    ],
    examples: [
      {
        title: "ブログ掲載前に横幅をそろえて WebP 化する",
        before: "photo01.jpg 4.8MB 4000×3000\nphoto02.png 2.1MB 2400×1600",
        after: "photo01-web.webp 420KB 1600×1200\nphoto02-web.webp 310KB 1600×1067",
        note:
          "横幅を 1600px にそろえ、縦横比を維持しながら WebP に変換するイメージです。"
      },
      {
        title: "元形式のまま小さくして案件接頭辞を付ける",
        before: "hero.jpg 3.2MB 3200×1800",
        after: "project-hero-optimized.jpg 690KB 1800×1013",
        note:
          "出力形式は元のままにしつつ、先頭と末尾に文字を加えて共有用の名前へ整えます。"
      }
    ],
    cautions: [
      "非常に大きい画像や大量画像では、ブラウザ内での処理に少し時間がかかることがあります。",
      "品質を下げるほど軽量になりやすい一方で、見た目の細かさも落ちる場合があります。",
      "軽量化率は元画像との概算比較です。設定によっては出力サイズが逆に大きくなることもあります。"
    ],
    faq: [
      {
        question: "画像はサーバーへ送信されますか？",
        answer:
          "いいえ。このツールはブラウザ内で処理し、ZIP 作成までローカルで行います。"
      },
      {
        question: "WebP とは何ですか？",
        answer:
          "WebP は、画像を比較的軽くしやすい画像形式です。見た目を大きく崩さず、jpg や png より容量を抑えられる場面が多いため、Web サイト用の画像でよく使われます。"
      },
      {
        question: "元の形式のまま出力することもできますか？",
        answer:
          "はい。出力形式を `元形式のまま` にすると、jpg / png / webp の形式を維持したままリサイズと品質調整だけ行えます。"
      }
    ],
    relatedTools: [
      {
        href: "/tools/file-batch-rename",
        label: "ファイル一括リネーム",
        description:
          "軽量化した画像ファイルへ案件名や連番をまとめて付けたいときに使えます。"
      }
    ],
    relatedArticles: [
      {
        href: "/guide",
        label: "使い方ガイド",
        description:
          "入力、確認、ダウンロードの基本的な流れを確認できます。"
      },
      {
        href: "/faq",
        label: "よくある質問",
        description:
          "入力データの扱い方、対応形式、お問い合わせ先などをまとめています。"
      },
      {
        href: "/privacy",
        label: "プライバシーポリシー",
        description:
          "入力データの扱い方と保存方針を確認できます。"
      }
    ],
    history: [
      {
        date: "2026-04-14",
        summary:
          "画像一括リサイズ / WebP変換ツールを追加し、ブラウザ内での軽量化と ZIP 一括ダウンロードに対応しました。"
      },
      {
        date: "2026-04-14",
        summary:
          "幅・高さ指定、縦横比維持、品質設定、Before / After 比較を追加しました。"
      }
    ],
    operation: {
      kind: "imageBatchResize",
      ui: {
        title: "画像設定と一括処理",
        description:
          "左で画像と出力条件を設定し、右で処理結果を確認します。問題がなければ ZIP で一括ダウンロードできます。",
        dropzone: {
          title: "対象画像",
          description:
            "jpg / jpeg / png / webp の画像を複数選択するか、ここへドラッグ＆ドロップしてください。",
          browseLabel: "画像を選ぶ",
          activeLabel: "ここに画像をドロップ",
          hint:
            "画像はサーバーへ送らず、ブラウザ内でリサイズ・変換・ZIP 作成を行います。"
        },
        emptyState: {
          title: "まだ画像が選択されていません",
          description:
            "まずは複数画像を追加すると、ここに Before / After の情報が表示されます。"
        },
        fields: {
          widthLabel: "出力幅",
          widthPlaceholder: "例: 1600",
          heightLabel: "出力高さ",
          heightPlaceholder: "例: 1200",
          keepAspectRatioLabel: "縦横比を維持する",
          outputFormatLabel: "出力形式",
          outputFormatOptions: {
            original: "元形式のまま",
            webp: "WebPへ変換"
          },
          qualityLabel: "品質",
          qualityHint:
            "数値を下げるほど軽くなりやすくなります。jpg / webp で特に影響が出やすい設定です。",
          prefixLabel: "出力名の先頭文字",
          prefixPlaceholder: "例: project-",
          suffixLabel: "出力名の末尾文字",
          suffixPlaceholder: "例: -web"
        },
        helper: {
          webpDescription:
            "WebP は Web 用に使われることが多い軽量な画像形式です。迷ったら WebP 変換を試し、見た目と容量のバランスを確認するのがおすすめです。",
          localProcessingNote:
            "画像処理と ZIP 作成は、このブラウザ内で完結します。元画像を外部へ送信せずに処理できます。",
          qualityNote:
            "品質を高くすると見た目は保ちやすくなりますが、容量は大きくなりやすくなります。",
          filenameRuleNote:
            "出力ファイル名は、元の名前に先頭 / 末尾文字を加えて作成します。拡張子は出力形式に応じて自動で決まります。"
        },
        preview: {
          title: "処理結果プレビュー",
          originalInfoLabel: "元画像",
          originalNameLabel: "元ファイル名",
          outputInfoLabel: "出力画像",
          outputNameLabel: "出力ファイル名",
          reductionLabel: "軽量化率の概算"
        },
        progress: {
          processingLabel: "処理中",
          readyLabel: "処理設定"
        },
        status: {
          processing: "処理中",
          ready: "準備OK",
          error: "要確認"
        },
        summary: {
          selectedCountLabel: "選択中",
          successCountLabel: "出力準備OK",
          errorCountLabel: "要確認"
        },
        actions: {
          downloadErrorLabel:
            "ZIP の作成に失敗しました。画像数や設定内容を確認して、もう一度お試しください。",
          downloadZipLabel: "ZIPで一括ダウンロード",
          downloadingZipLabel: "ZIPを作成中...",
          resetLabel: "リセット",
          zipFileName: "processed-images-ja.zip"
        },
        validation: {
          unsupportedFormat: "未対応形式の画像です。jpg / jpeg / png / webp を使ってください。",
          loadFailed: "画像の読み込みに失敗しました。",
          convertFailed: "画像の変換に失敗しました。",
          invalidName: "出力ファイル名に使えない文字が含まれています。",
          duplicateName: "同じ出力ファイル名が複数あります。"
        }
      }
    }
  },
  "pdf-page-organizer": {
    slug: "pdf-page-organizer",
    title: "PDFページ整理",
    category: "PDFページ整理・結合・分割",
    description:
      "PDF をブラウザで開き、ページ一覧を見ながら並び替え、不要ページ削除、複数PDFの結合、ページ範囲ごとの分割を行い、そのままダウンロードできるローカル処理ツールです。",
    metadata: {
      title: "PDFページ整理 | 整理と変換の道具箱",
      description:
        "PDF のページ順変更、不要ページ削除、複数PDFの結合、ページ範囲ごとの分割をブラウザ上で行い、整理後のPDFをローカルで生成できるツールです。",
      keywords: [
        "PDFページ整理",
        "PDF 並び替え",
        "PDF ページ削除",
        "PDF 順番変更",
        "ローカル処理"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      "pdf",
      "複数の PDF ファイル",
      "ローカルブラウザ処理"
    ],
    capabilities: [
      "1つ以上の PDF をブラウザで開き、ページ一覧を見ながらまとめて整理できる",
      "複数 PDF を読み込み順または並び替えた順で 1 つの PDF に結合できる",
      "ドラッグ＆ドロップで並び替えでき、モバイル向けに上下移動ボタンも使える",
      "ページ単位の削除と複数ページのまとめ削除に対応している",
      "ページ中身のサムネイルを見ながら、ページ範囲ごとに ZIP で分割ダウンロードできる"
    ],
    idealFor: [
      "提案書、会議資料、配布用 PDF の順番を提出前に整えたい人",
      "複数の PDF を 1 本にまとめて共有したい人",
      "契約書や配布資料をページ範囲ごとに分けて保存したい人",
      "表紙や空白ページ、不要な補足ページだけを取り除きたい人",
      "本格的な PDF 編集ソフトを開かずに、まず順番整理だけ素早く済ませたい人"
    ],
    steps: [
      {
        title: "PDF を追加する",
        description:
          "PDF ファイルを 1 つ以上選ぶか、ドラッグ＆ドロップで取り込みます。"
      },
      {
        title: "ページ順と不要ページを整理する",
        description:
          "ページカードをドラッグして順番を変え、不要ページを削除します。必要に応じて上下移動ボタンも使えます。"
      },
      {
        title: "結合または分割の形を決める",
        description:
          "現在の並びをそのまま 1 つの PDF として保存するか、`1-3, 4-6` のように範囲を指定して ZIP 分割するかを選びます。"
      },
      {
        title: "結果をダウンロードする",
        description:
          "並び順と削除内容に問題がなければ、新しい PDF または分割 ZIP として保存します。"
      }
    ],
    examples: [
      {
        title: "補足資料が途中に入った PDF を正しい順番へ戻す",
        before: "ページ順: 1, 2, 8, 9, 3, 4, 5, 6, 7",
        after: "ページ順: 1, 2, 3, 4, 5, 6, 7, 8, 9",
        note:
          "出力時に順番が崩れた PDF を、読みやすい並びへ戻す用途です。"
      },
      {
        title: "表紙と最後の空白ページを削除する",
        before: "残す前: 1, 2, 3, 4, 5, 6",
        after: "残した後: 2, 3, 4, 5",
        note:
          "共有時に不要な表紙や空白ページだけを外したいときに向いています。"
      }
    ],
    cautions: [
      "サムネイルはページ内容確認用の簡易表示です。細かい文字や注釈までは見えにくい場合があります。",
      "ページ数が多い PDF やサイズの大きい PDF は、ブラウザ内での読み込みや再生成に時間がかかることがあります。",
      "分割範囲は現在の並び順を基準に、`1-3, 4-6, 7` のような重複しない書き方で指定してください。",
      "保護の強い PDF や特殊な構造の PDF は読み込みに失敗する場合があります。"
    ],
    faq: [
      {
        question: "PDF はどこかにアップロードされますか？",
        answer:
          "いいえ。このツールはブラウザ内で PDF を読み込み、並び替え、再生成する設計です。"
      },
      {
        question: "PDF の結合や分割もできますか？",
        answer:
          "はい。複数の PDF をまとめて読み込むと、そのまま1つのPDFとして結合して保存できます。分割は `1-3, 4-6` のようなページ範囲指定で ZIP ダウンロードできます。"
      },
      {
        question: "ページの中身も見られますか？",
        answer:
          "はい。各ページカードに簡易サムネイルを表示しています。細かな文字確認までは難しいことがありますが、ページ内容と順番は把握しやすくなっています。"
      },
      {
        question: "スマホでも使えますか？",
        answer:
          "はい。ドラッグ操作がしづらい場合に備えて、上下移動ボタンも使えるようにしています。"
      }
    ],
    relatedTools: [
      {
        href: "/tools/file-batch-rename",
        label: "ファイル一括リネーム",
        description:
          "整理後に書き出した PDF ファイル名も、共有前にわかりやすく整えられます。"
      },
      {
        href: "/tools/text-cleanup",
        label: "文章整形ツール",
        description:
          "PDF と一緒に送るメモや要約文も、コピー前に整えたいときに便利です。"
      }
    ],
    relatedArticles: [
      {
        href: "/guide/reorder-pdf-pages",
        label: "PDFのページ順を直す方法",
        description:
          "不要ページを減らしてから順番を直す、失敗しにくい進め方を確認できます。"
      },
      {
        href: "/guide",
        label: "使い方ガイド一覧",
        description:
          "整理・変換作業の進め方をまとめたガイドを一覧で確認できます。"
      },
      {
        href: "/faq",
        label: "よくある質問",
        description:
          "入力データの扱い方や対応形式、使い方の疑問を確認できます。"
      }
    ],
    history: [
      {
        date: "2026-04-14",
        summary:
          "PDFページ整理ツールを追加し、ローカル読み込み、ページ一覧確認、整理後 PDF ダウンロードに対応しました。"
      },
      {
        date: "2026-04-14",
        summary:
          "複数PDFの結合、ページ範囲分割 ZIP、ページ中身サムネイル、ドラッグ並び替えに対応しました。"
      }
    ],
    operation: {
      kind: "pdfPageOrganizer",
      ui: {
        title: "PDFアップロードとページ操作",
        description:
          "PDF を 1 つ以上追加し、ページ一覧を見ながら順番変更、不要ページ削除、結合、分割を行い、結果をダウンロードできます。",
        actions: {
          clearSelectionLabel: "選択解除",
          deleteSelectedLabel: "選択ページを削除",
          downloadLabel: "整理結果PDFをダウンロード",
          downloadingLabel: "PDFを生成中...",
          resetLabel: "リセット",
          selectAllLabel: "すべて選択",
          splitDownloadLabel: "分割ZIPをダウンロード",
          splittingLabel: "分割ZIPを生成中..."
        },
        dropzone: {
          title: "PDFファイル",
          description:
            "PDF ファイルを 1 つ以上選ぶか、ここへドラッグ＆ドロップしてください。",
          browseLabel: "PDFを選ぶ",
          activeLabel: "ここにPDFをドロップ",
          hint:
            "PDF はブラウザ内で処理されます。複数PDFの結合、ページ確認、並び替え、分割書き出しはローカルで完結します。"
        },
        emptyState: {
          title: "まだPDFが選ばれていません",
          description:
            "PDF を追加すると、ここにページ一覧、サムネイル、整理結果のサマリーが表示されます。"
        },
        fields: {
          currentPageLabel: "現在のページ順",
          deletePageLabel: "このページを削除",
          moveDownLabel: "下へ移動",
          moveUpLabel: "上へ移動",
          originalPageLabel: "元のページ番号",
          pageInfoLabel: "ページ情報",
          pageListLabel: "ページ一覧",
          pageSizeLabel: "ページサイズ",
          rotationLabel: "回転",
          selectPageLabel: "ページを選択",
          sourceFileLabel: "元ファイル",
          splitRangeLabel: "分割するページ範囲",
          splitRangePlaceholder: "例: 1-3, 4-6, 7"
        },
        helper: {
          mergeNote:
            "複数の PDF を追加すると、現在の一覧順のまま 1 つの PDF として結合して保存できます。",
          localProcessingNote:
            "選択した PDF はブラウザ内で読み込みと再生成を行います。AI 学習用に送信する仕組みは入れていません。",
          mobileNote:
            "スマホではドラッグよりも上下移動ボタンのほうが使いやすい場合があります。",
          reorderNote:
            "ページカードをドラッグすると順番を変えられます。書き出し後の PDF には、一覧に表示された順番がそのまま反映されます。",
          splitNote:
            "現在の並び順を基準に `1-3, 4-6` のような範囲を指定すると、範囲ごとの PDF を ZIP でまとめて保存できます。"
        },
        preview: {
          dragHintLabel: "ドラッグでページ順を変更できます",
          emptyLabel: "未選択",
          renderingLabel: "サムネイルを準備中...",
          selectedLabel: "選択中",
          title: "ページサマリーと現在の並び"
        },
        sections: {
          controls: "ページ操作",
          split: "PDF分割",
          summary: "現在のサマリー"
        },
        summary: {
          currentCountLabel: "現在残っているページ数",
          fileLabel: "読み込んだファイル",
          originalCountLabel: "元のページ数",
          removedCountLabel: "削除したページ数",
          selectedCountLabel: "選択中のページ数",
          sourceCountLabel: "読み込んだPDF数"
        },
        status: {
          loading: "PDFを読み込み中...",
          ready: "ページ一覧を確認できます"
        },
        validation: {
          emptyFile: "選択した PDF が空のようです。",
          exportFailed: "整理後 PDF の作成に失敗しました。もう一度お試しください。",
          invalidSplitRange:
            "分割範囲が正しくありません。`1-3, 4, 5-7` のように、重複しない範囲で入力してください。",
          loadFailed: "PDF の読み込みに失敗しました。",
          noPagesRemaining: "ダウンロードするには 1 ページ以上残してください。",
          noSplitTargets: "分割するページ範囲を入力してください。",
          unsupportedFormat: "未対応の形式です。PDF ファイルを選んでください。"
        }
      }
    }
  },
  "subtitle-shift-convert": {
    slug: "subtitle-shift-convert",
    title: "SRT / VTT 字幕ずらし・変換",
    category: "字幕タイミング調整と形式変換",
    description:
      "SRT または VTT の字幕ファイルをブラウザで開き、字幕タイミングをまとめて前後にずらし、SRT / VTT を相互変換し、そのままダウンロードできるローカル処理ツールです。",
    metadata: {
      title: "SRT / VTT 字幕ずらし・変換 | 整理と変換の道具箱",
      description:
        "字幕ファイルのタイミングをまとめて前後にずらし、SRT と VTT を相互変換し、行番号やヘッダーを整えてローカルで保存できるツールです。",
      keywords: [
        "字幕ずらし",
        "SRT VTT 変換",
        "字幕タイミング調整",
        "SRT to VTT",
        "VTT to SRT"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      ".srt",
      ".vtt",
      "ローカルブラウザ処理"
    ],
    capabilities: [
      "SRT と VTT の字幕ファイルを 1 ファイルずつブラウザで開ける",
      "字幕全体をミリ秒単位または秒単位で前後にまとめてずらせる",
      "SRT → VTT、VTT → SRT の変換と、行番号・ヘッダーの基本整形ができる",
      "元テキスト、変換後テキスト、タイムスタンプ一覧を見比べてから保存できる"
    ],
    idealFor: [
      "動画書き出し後に字幕だけ少し早い、または遅い状態を直したい人",
      "語学学習で別配信版の字幕を手元の動画に合わせたい人",
      "字幕エディタを開かずに、まず簡単な時刻調整と形式変換だけ済ませたい人"
    ],
    steps: [
      {
        title: "字幕ファイルを追加する",
        description:
          "SRT または VTT ファイルを 1 つ選ぶか、ドラッグ＆ドロップで取り込みます。"
      },
      {
        title: "ずらす量を設定する",
        description:
          "プラスかマイナスを選び、ずらす量を入力して、秒またはミリ秒を選びます。"
      },
      {
        title: "出力形式を選ぶ",
        description:
          "元の形式のまま使うか、SRT と VTT のどちらかへ変換するかを選びます。"
      },
      {
        title: "結果を確認して保存する",
        description:
          "元テキスト、結果テキスト、タイムスタンプ一覧を確認してからダウンロードします。"
      }
    ],
    examples: [
      {
        title: "動画開始が遅れた分だけ字幕を 1.5 秒遅らせる",
        before: "00:00:05,000 --> 00:00:07,200",
        after: "00:00:06,500 --> 00:00:08,700",
        note:
          "字幕が早く表示されるときは、プラス方向へずらします。"
      },
      {
        title: "VTT を 300ms 早めて SRT に変換する",
        before: "00:01:12.400 --> 00:01:14.000",
        after: "00:01:12,100 --> 00:01:13,700",
        note:
          "Web 用字幕を一般的な SRT として使いたいときにも便利です。"
      }
    ],
    cautions: [
      "マイナス方向へ大きくずらして 00:00 より前になる字幕は、先頭時刻に切り詰められます。",
      "VTT 専用の補助情報やスタイル情報は、SRT に変換すると引き継がれません。",
      "タイムスタンプ行が壊れている字幕や独自形式の字幕は読み込みに失敗する場合があります。"
    ],
    faq: [
      {
        question: "SRT と VTT の違いは何ですか？",
        answer:
          "SRT は連番行とカンマ区切りの時刻を使うシンプルな形式です。VTT は WEBVTT ヘッダーを持ち、時刻にドットを使い、Web向けの追加情報も持てます。"
      },
      {
        question: "プラスとマイナスはどう使い分けますか？",
        answer:
          "字幕が早く出るときはプラス、字幕が遅れて出るときはマイナスを選ぶと分かりやすいです。"
      },
      {
        question: "字幕ファイルはどこかにアップロードされますか？",
        answer:
          "いいえ。このツールはブラウザ内で字幕の読み込み、時間ずらし、形式変換を行う設計です。"
      }
    ],
    relatedTools: [
      {
        href: "/tools/text-cleanup",
        label: "文章整形ツール",
        description:
          "字幕本文のメモや補足テキストも、コピー前に軽く整えたいときに便利です。"
      },
      {
        href: "/tools/file-batch-rename",
        label: "ファイル一括リネーム",
        description:
          "変換後の字幕ファイル名に言語名や版情報をまとめて付けたいときに使えます。"
      }
    ],
    relatedArticles: [
      {
        href: "/guide/shift-srt-vtt-subtitles",
        label: "SRT字幕をずらす方法",
        description:
          "字幕が早いとき・遅いときの考え方や、SRT / VTT 変換の使いどころを確認できます。"
      },
      {
        href: "/guide",
        label: "使い方ガイド一覧",
        description:
          "整理・変換作業の進め方をまとめたガイドを一覧で確認できます。"
      },
      {
        href: "/faq",
        label: "よくある質問",
        description:
          "入力データの扱い方や対応形式、使い方の疑問を確認できます。"
      }
    ],
    history: [
      {
        date: "2026-04-14",
        summary:
          "字幕ずらし・変換ツールを追加し、SRT / VTT のローカル読み込みとダウンロードに対応しました。"
      },
      {
        date: "2026-04-14",
        summary:
          "時間ずらし、SRT / VTT 変換、タイムスタンプ一覧プレビュー、基本整形を追加しました。"
      }
    ],
    operation: {
      kind: "subtitleShiftConvert",
      ui: {
        title: "字幕タイミングと形式変換の設定",
        description:
          "字幕ファイルを 1 つ追加し、ずらす量と出力形式を設定して、処理結果を確認しながら保存できます。",
        actions: {
          downloadLabel: "字幕ファイルをダウンロード",
          downloadingLabel: "字幕ファイルを準備中...",
          resetLabel: "リセット"
        },
        dropzone: {
          title: "字幕ファイル",
          description:
            "SRT または VTT ファイルを 1 つ選ぶか、ここへドラッグ＆ドロップしてください。",
          browseLabel: "ファイルを選ぶ",
          activeLabel: "ここに字幕ファイルをドロップ",
          hint:
            "字幕ファイルはブラウザ内で処理されます。読み込み、時間調整、変換はローカルで完結します。"
        },
        emptyState: {
          title: "まだ字幕ファイルが選ばれていません",
          description:
            "SRT または VTT ファイルを追加すると、ここに元テキスト、タイムスタンプ一覧、結果プレビューが表示されます。"
        },
        fields: {
          cueTextLabel: "字幕テキスト",
          endLabel: "終了",
          offsetDirectionLabel: "ずらす方向",
          offsetDirectionOptions: {
            minus: "早める",
            plus: "遅らせる"
          },
          offsetLabel: "ずらす量",
          offsetPlaceholder: "例: 1.5",
          outputFormatLabel: "出力形式",
          outputFormatOptions: {
            srt: "SRT",
            vtt: "VTT"
          },
          shiftUnitLabel: "時間単位",
          shiftUnitOptions: {
            milliseconds: "ミリ秒",
            seconds: "秒"
          },
          startLabel: "開始",
          timestampListLabel: "タイムスタンプ一覧"
        },
        helper: {
          clampNote:
            "マイナス方向へずらして 00:00 より前になる字幕は、先頭時刻で止まります。",
          localProcessingNote:
            "字幕の読み込み、時間ずらし、形式変換はブラウザ内で行います。AI 学習用に送信する仕組みは入れていません。",
          srtVttDifferenceNote:
            "SRT は連番行とカンマ区切り時刻を使い、VTT は WEBVTT ヘッダーとドット区切り時刻を使います。"
        },
        preview: {
          originalTextTitle: "元の字幕テキスト",
          processedTextTitle: "処理後の字幕テキスト",
          processedTimingLabel: "処理後の時刻",
          sourceTimingLabel: "元の時刻",
          title: "字幕プレビューとタイムスタンプ一覧"
        },
        sections: {
          conversion: "形式変換",
          summary: "現在のサマリー",
          timingShift: "時間ずらし"
        },
        summary: {
          clampedCueCountLabel: "先頭で止まった字幕数",
          cueCountLabel: "字幕数",
          fileLabel: "選択中のファイル",
          offsetLabel: "適用中のずらし量",
          outputFormatLabel: "出力形式",
          sourceFormatLabel: "元の形式"
        },
        status: {
          loading: "字幕ファイルを読み込み中...",
          ready: "結果を確認できます"
        },
        validation: {
          emptyFile: "選択した字幕ファイルが空のようです。",
          invalidFormat: "通常の SRT または VTT 字幕として読み取れませんでした。",
          invalidTimestamp: "タイムスタンプ行の一部が壊れているようです。",
          loadFailed: "字幕ファイルの読み込みに失敗しました。",
          noCues: "字幕行が見つかりませんでした。",
          unsupportedFormat: "未対応の形式です。.srt または .vtt を選んでください。"
        }
      }
    }
  },
  "text-cleanup": {
    slug: "text-cleanup",
    title: "文章整理ツール",
    category: "文章整理と箇条書き整形",
    description:
      "貼り付けた文章の改行や箇条書き記号をブラウザ上で整え、次の作業へそのまま持っていきやすくするローカル処理ツールです。",
    metadata: {
      title: "文章整理ツール | 整理と変換の道具箱",
      description:
        "貼り付けた文章、改行、箇条書きをブラウザ内で整えるためのローカル処理ツールです。",
      keywords: [
        "文章整理ツール",
        "箇条書き整形",
        "テキスト整形",
        "ローカル処理"
      ]
    },
    structuredData: {
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any"
    },
    supportedFormats: [
      "プレーンテキスト",
      "文書やチャットから貼り付けた箇条書き",
      "スプレッドシート由来のシンプルな表テキスト"
    ],
    capabilities: [
      "各行の前後にある余分な空白を整える",
      "連続した空行を 1 つの区切りにまとめる",
      "混在した箇条書き記号をそろえる",
      "コピー前に整形結果をその場で確認できる"
    ],
    idealFor: [
      "会議メモを共有前に整えたい人",
      "フォームや CMS に文章を貼る前に体裁を整えたい人",
      "資料や表からコピーした荒いテキストを短時間で見やすくしたい人"
    ],
    steps: [
      {
        title: "元の文章を貼り付ける",
        description:
          "コピー元の文章や箇条書きを、そのまま入力欄へ貼り付けます。"
      },
      {
        title: "整形オプションを選ぶ",
        description:
          "改行整理、行頭行末の空白整理、箇条書き記号の統一を必要に応じて切り替えます。"
      },
      {
        title: "結果を確認してコピーする",
        description:
          "右側の整形結果を見て、次の作業に使える状態になったらそのままコピーします。"
      }
    ],
    examples: [
      {
        title: "会議メモの整理",
        before: "  議題\n\n\n・公開日を確認\n●下書きURLを共有\n\n  次の対応: 連絡する  ",
        after: "議題\n\n- 公開日を確認\n- 下書きURLを共有\n\n次の対応: 連絡する",
        note:
          "余分な空行をまとめ、箇条書き記号を統一し、行の前後にある不要な空白を取り除きます。"
      },
      {
        title: "チャット投稿前のタスクリスト整理",
        before: " タスク\n\n• バナー文言を更新\n○ csv 見出しを確認\n   ・最終メモを送る ",
        after: "タスク\n\n- バナー文言を更新\n- csv 見出しを確認\n- 最終メモを送る"
      }
    ],
    cautions: [
      "外部システムへ貼り付ける前に、整形結果を一度確認してください。",
      "箇条書き記号の統一は、一覧用途の行を前提にしています。記号自体に意味がある文章には向かない場合があります。",
      "非常に大きい文書や厳密な構造を持つ原稿は、今後より専用のツールが必要になる可能性があります。"
    ],
    faq: [
      {
        question: "このツールは文章をどこかへ送信しますか？",
        answer:
          "いいえ。入力した文章はブラウザ内で処理し、AI 学習用に送信する仕組みは入れていません。"
      },
      {
        question: "どの箇条書き記号を統一しますか？",
        answer:
          "主に `・`, `•`, `●`, `○`, `▪` や、単純な行頭ハイフンのような、貼り付け時によく混ざる記号を対象にしています。"
      },
      {
        question: "空行を残したい場合はどうすればよいですか？",
        answer:
          "各整形オプションは個別に切り替えられるので、空行の整理だけオフにして使うことができます。"
      }
    ],
    relatedTools: [
      {
        href: "/tools/file-batch-rename",
        label: "ファイル一括リネーム",
        description:
          "共有前のファイル名整理や連番付与も、ブラウザ内でまとめて行えます。"
      }
    ],
    relatedArticles: [
      {
        href: "/guide",
        label: "使い方ガイド",
        description:
          "入力、確認、コピーの基本的な流れを先に確認できます。"
      },
      {
        href: "/faq",
        label: "よくある質問",
        description:
          "入力データの扱い方、対応形式、お問い合わせ先などをまとめています。"
      },
      {
        href: "/privacy",
        label: "プライバシーポリシー",
        description:
          "入力データの扱い方と保存方針を確認できます。"
      }
    ],
    history: [
      {
        date: "2026-04-14",
        summary:
          "文章整理ツールページを追加し、ガイドや関連情報とあわせて使いやすくしました。"
      },
      {
        date: "2026-04-14",
        summary:
          "ローカル処理で使える簡易的な文章整理操作エリアを追加しました。"
      }
    ],
    operation: {
      kind: "textCleanup",
      ui: {
        title: "ツール操作エリア",
        description:
          "左に元文章を貼り付け、右で整形結果を確認し、そのままコピーできます。",
        inputLabel: "元の文章",
        inputPlaceholder:
          "ここに荒い文章や箇条書きを貼り付けてください...",
        outputLabel: "整形後の結果",
        outputPlaceholder:
          "入力すると、ここに整形結果が表示されます。",
        optionsLegend: "整形オプション",
        options: {
          collapseBlankLines: "連続した空行をまとめる",
          normalizeBullets: "よくある箇条書き記号を統一する",
          trimLineEdges: "各行の前後にある余分な空白を整える"
        },
        copyLabel: "結果をコピー",
        copiedLabel: "コピーしました",
        copyErrorLabel: "コピーに失敗しました。手動で結果を選択してください。",
        clearLabel: "クリア"
      }
    }
  }
};
