
const webviewMaxLimitMsg = '超出页面栈数量';
const cannotToTabbarPageMsg = '无法跳转到tabbar页面';

const isDebug = true;

/**
 * 获取首页路径
 * @returns string 首页路径
 */
function getHomePage() {
  // @ts-ignore
  return '/' + __wxConfig.pages[0];
}


/**
 * 暂时只适用于 functionName(options:object={}) 此类小程序方法
 * @param {*} methodName 方法名称
 * @param {*} params {} 只能是 object 类型
 * @returns Promise | null
 */
export function overrideWxMethod(methodName: string = '', params: object = {}) {
  const proxyWx: any = wx;
	return new Promise((resolve, reject) => {
	  if (methodName) {
		try {
		  proxyWx[methodName]({ 
        ...params, 
        fail: (e: any) => {
          getWxErrMsg(e).then((msg: string) => {
            if (isDebug) wxShowToast(msg);
            // [e, msg] = [原始异常, 自定义的异常信息]
            setTimeout(() => {
              reject([e, msg]);
            }, isDebug ? 2000 : 0);
          });
        },
        success: (e: unknown) => resolve(e)
		  });
		} catch (error) {
		  console.error(error);
		  console.log('方法不存在');
		}
	  } else {
		  console.warn('请输入方法名');
	  }
	});
}
  

/**
 * 页面跳转
 * @param {object} param 
 */
export function wxNavigateTo(
  { url, success, fail, complete }: { url: string, success?: Function, fail?: Function, complete?: Function }
) {
	return new Promise((resolve, reject) => {
		overrideWxMethod('navigateTo', {
				url
			})
			.then((res) => {
				resolve(res);
				if (success) success(res);
			})
			.catch(([e, err]) => {
				if (err === webviewMaxLimitMsg) {
					// 如果错误类型是超出webview页面栈限制，使用 `redirectTo`
					overrideWxMethod('redirectTo', {
							url
						})
						.then((res) => {
							resolve(res);
							if (success) success(res);
						})
						.catch((err) => {
							reject(err);
							if (fail) fail(err);
						});
				} else if (err === cannotToTabbarPageMsg) {
					// 如果错误类型是要跳转的页面是tabbar页面， 使用 `switchTab`
					overrideWxMethod('switchTab', {
							url
						})
						.then((res) => {
							resolve(res);
							if (success) success(res);
						})
						.catch((err) => {
							reject(err);
							if (fail) fail(err);
						});
				} else {
					reject(err);
					if (fail) fail(err);
				}
			})
			.finally(() => {
				if (complete) complete();
			});
	});
}


/**
 * 返回上个页面 如果是第一个页面 返回 首页
 */
export function onNavigateBack(reload = false) {
	let pages = getCurrentPages();
	if (pages && pages.length) {
		let homePage = getHomePage();
		if (pages.length === 1) {
			wxNavigateTo({
				url: homePage
			}).then(() => {
				if (reload) {
					let pages = getCurrentPages();
					let currentPage = pages[0];
					currentPage.onLoad(currentPage.options);
				}
			});
		} else {
			let beforePage = pages[pages.length - 2];
			if (beforePage) {
				if (reload) {
					overrideWxMethod('navigateBack', {
						complete: function () {
							beforePage.onLoad(beforePage.options);
						}
					});
				} else {
					overrideWxMethod('navigateBack');
				}
			}
		}
	}
}


export function wxShowToast(title: string, icon = 'none', duration = 1500, delay = 0) {
  return new Promise((resolve) => {
    overrideWxMethod('showToast', {
      title,
      icon,
      duration,
    }).then((e) => {
      setTimeout(() => {
        resolve(e);
      }, delay);
    });
  });
}


/**
 * 微信内置方法 错误信息转换
 * @param {String} errMsg
 * @returns Promise<String>
 */
export function getWxErrMsg(wxFailErr: any): Promise<string> {
  return new Promise((resolve) => {
    const { errMsg, errno } = wxFailErr;
    let translateErrMsgObject = undefined;
    let wxNoErrnoMsgObject: any = {
        'fail filetype not supported': '不支持此类型文件',
        'navigateTo:fail webview count limit exceed': webviewMaxLimitMsg,
        'navigateTo:fail can not navigateTo a tabbar page': cannotToTabbarPageMsg,
    };

    let customObjectHasThisWxFailErr = false;

    let msg: string = '';
    if (!translateErrMsgObject) {
      const keys = Object.keys(wxNoErrnoMsgObject);
      for (let index = 0; index < keys.length; index++) {
        const key = keys[index];
        if (errMsg.indexOf(key) !== -1) {
            msg = wxNoErrnoMsgObject[key];
            customObjectHasThisWxFailErr = true;
            break;
        }
      }
    }
    if (translateErrMsgObject) msg = translateErrMsgObject.cn;
    if (!translateErrMsgObject && !customObjectHasThisWxFailErr) msg = errMsg;
    if (isDebug) console.log(msg + '; errMsg:' + errMsg);;

    resolve(msg);
  });
}
