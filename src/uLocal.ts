// #ifdef H5
import { set, setMany, get, getMany, del, delMany, clear, keys, values } from 'idb-keyval';
// #endif

type ICacheKey = string | string[];
type ICacheTime = string | boolean | number;

export default class ULocal {
	// 缓存数据
	// public cacheData: unknown = new Map();
	
	// 缓存键值
	public cacheKey: ICacheKey = 'u_local_cache_key';
	
	// tag标识,可通过tag获取所有相同tag数据
	public cacheTag: string = 'cache_tag';
	
	// 缓存时间 - 0 false 不过期
	private cacheTime: ICacheTime = false;
	
	// 初始化时间
	protected initTime: number;
	
	constructor(key: ICacheKey, data?: unknown | any[], tag?: string, time?: ICacheTime) {
		this.initTime = Math.floor(new Date().valueOf() / 1000);
		// 初始化缓存时间
		if (time) {
			this.cacheTime = time;
		}
		// 在键值且填充数据存在的时候,才进行后续操作
		if (key && data) {
			if (Array.isArray(key)) {
				// 批量设置/获取
				this.setMore(key, data as any[], tag);
			} else {
				this.set(key, data, tag);
			}			
		}
	}
	
	async set(key: string | string[], data: unknown | any[], tag?: string) {
		if (Array.isArray(key) && !Array.isArray(data)) {
			throw new Error('The argument of data must be an Array when key is an Array');
		}
		this.updateDatabase(key, data, tag);
		
		this.setTagMapping(tag, key);
	}
	
	setMore(keys: string[], datas: any[], tag?: string) {
		this.updateDatabase(keys, datas, tag);
		
		this.setTagMapping(tag, keys);
	}
	
	async get(key: string): Promise<any> {
		return await get(key);
	}
	
	async getMore(keys: string[]) {
		return await getMany(keys);
	}
	// 通过tag获取所有数据
	async getByTag(tag: string) {
		const _tagKeys = await get(tag) || [];
		return await this.getMore(_tagKeys);
	}
	// 删除单个数据
	async del(key: string) {
		await del(key);
	}
	// 删除多组数据
	async delMore(keys: string[]) {
		await delMany(keys)
	}
	// 通过tag删除数据
	async delByTag(tag: string) {
		const _tagKeys = await get(tag) || [];
		return await this.delMore(_tagKeys);
	}
	// 获取所有的键值
	async getAllKeys() {
		return await keys();
	}
	// 获取所有储存的数据
	async getAllValues() {
		return await values();
	}
	// 清除存储的所有的值
	clear() {
		clear();
	}
	// 设置数据
	async updateDatabase(key: string | string[], data: unknown | any[], tag?:string) {
		const _data = this.transData(key, data, tag);
		const isKeys = Array.isArray(key);
		
		// #ifndef H5
		if (isKeys) {
			await Promise.all(key.map((v, i) => {
				return uni.setStorage(v, _data[i]);
			}))
		} else {
			await uni.setStorage(key, _data);
		}
		// #endif
		
		// #ifdef H5
		if (isKeys) {
			await setMany(key.map((v, i) => {
				return [v, _data[i]]
			})).catch(e => {
				this.errorCall(e)
			});
		} else {			
			await set(key, _data).catch(e => {
				this.errorCall(e)
			});
		}
		// #endif
	}
	
	// 设置tag映射
	async setTagMapping(tag: string, key: string | string[]) {
		// 存储tag数据 tag - key[]
		const localTag = await get(tag) || [];
		const _key = Array.isArray(key) ? key : [key];
		
		const _keysData = Array.from(new Set([...localTag, ..._key]));
		
		set(tag, _keysData);
	}
	
	// 数据转换
	transData(key: string | string[], data: unknown | unknown[], tag?: string) {
		const isKeys = Array.isArray(key);
		if (isKeys) {
			return key.map((v, i) => {
				return this.transDataTools(v, data[i], tag)
			})
		} else {
			return this.transDataTools(key, data, tag);
		}
	}
	transDataTools(key: string, data: unknown, tag?: string) {
		return {
			key,
			data,
			tag,
			time: this.getCacheTime()
		}
	}
	// 时间过期机制
	// 在下一次初始化时，判断是否过期，来决定是否延用/清除数据
	getCacheTime(): string | number {
		const { initTime, cacheTime } = this;
		// 0  false -- 不过期
		if (!cacheTime || (typeof cacheTime === 'number' && cacheTime < 0)) {
			return 'NO';
		} else {
			return +initTime + +cacheTime;
		}
	}
	// 异常处理
	errorCall(e) {
		console.log('error', e);
	}
}