function doGet() {
  var template = 'index';
  return HtmlService
    .createTemplateFromFile('index')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')  //html側にメタタグを設定しても意味がなかったためこちらで
}

function doPost(e){
  SendToNotion(e.parameter.title,e.parameter.subtitle,e.parameter.authors,e.parameter.publishedDate,
                  Number(e.parameter.pageCount),e.parameter.isbn,e.parameter.imageSrc);
}

// Notion API
function SendToNotion(title,subtitle,authors,publishedDate,pageCount,isbn,imageSrc) {
  const notion_key = 'secret_T3TTs9MO53bjZuCWwdze78J7ZcFMXxizp7DNTqRcgdj';
  const database_id = '6100bf98e84846c69229f2bc0b6a67a4';

  json_data = {
    'parent': {'database_id': database_id},
    'properties': {
      // ↓ここにプロパティをカンマで区切って記述していく
      '書名': {
        'title': [
          {
            'text': {
              'content': title,
            }
          }
        ]
      },
      'サブタイトル': {
        'rich_text': [
          {
            'text': {
              'content': subtitle,
            }
          }
        ]
      },
      '著者': {
        'rich_text': [
          {
            'text': {
              'content': authors,
            }
          }
        ]
      },
      '状態': {
        'select': {
          'name': '蔵書',
        }
      },
      '最終更新者': {
        'RecentChanges': {
          'name': '',
        }
      },
      '出版年月': {
        'rich_text': [
          {
            'text': {
              'content': publishedDate, //本によって形式がバラバラなので文字列とする
            }
          }
        ]
      },
      '総ページ数': {
        'number': pageCount,
      },
      'ISBN': {
        'rich_text': [
          {
            'text': {
              'content': isbn,
            }
          }
        ]
      }
      // ↑ここまでプロパティ
    },
    'children': [
      // ↓こっちは本文ブロック
      {
        'object': 'block',
        'type': 'image',
        "image": {
          "type": "external",
          "external": {
              "url": imageSrc
          }
        }
      }
      // ↑ここまで本文
    ]
  };

  UrlFetchApp.fetch( 'https://api.notion.com/v1/pages', {
    "method" : "post",
    "headers" : {
      'Content-Type' : 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + notion_key,
      'Notion-Version': '2021-05-13',
    },
    "payload" : JSON.stringify( json_data )
  });
}