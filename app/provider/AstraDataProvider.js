import { fetchUtils } from "react-admin";
import { stringify } from "query-string";
import { AstraResources as resources } from "./AstraResources";

const apiRESTUrl = `/api/rest`;
const apiJSONUrl = `/api/json`;

const API = {
  REST: {
    getBase: (resource, query) => `${apiRESTUrl}/${resource}`,
    getList: (resource, query) =>
      `${apiRESTUrl}/${resource}/rows?${stringify(query)}`,
    getManyByKey: (resource, id) =>
      `${apiRESTUrl}/${resource}/${IdToRecord(resource, id)}`,
    getOne: (resource, id) =>
      `${apiRESTUrl}/${resource}/${IdToRecord(resource, id)}`,
    getMany: (resource, id) =>
      `${apiRESTUrl}/${resource}/${IdToRecord(resource, id)}`,
  },
  JSON: {
    getList: (resource, query) => `${apiJSONUrl}/${resource}`,
    getOne: (resource, id) => `${apiJSONUrl}/${resource}`,
  },
};

const tranformData = (resource, data) => {
  // REST API
  if (Array.isArray(data))
    return data.map((r) => ({
      id: RecordId(resource, r),
      ...r,
    }));

  // DOCUMENT API
  return Object.keys(data).map((k) => {
    return {
      id: k,
      ...data[k],
    };
  });
};

const getApiOptions = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user)
    return {
      headers: new Headers({}),
    };

  return {
    headers: new Headers(),
  };
};
const apiOptions = getApiOptions();

const httpClient = fetchUtils.fetchJson;

const SEPARATOR = "%";
const RecordId = (resource, record) => {
  console.log(record)
  return resources[resource].key.map((k) => record[k]).join(SEPARATOR);
};

const IdToRecord = (resource, id) => {
  return id.split(SEPARATOR).join("/");
};

const AstraDataProvider = {
  getList: (resource, params) => {
    if (resources[resource].API === "REST")
      return AstraDataRESTProvider.getList(resource, params);
  },

  getOne: (resource, params) => {
    if (resources[resource].API === "REST")
      return AstraDataRESTProvider.getOne(resource, params);
    else if (resources[resource].API === "JSON")
      return AstraDataJSONProvider.getOne(resource, params);
  },

  getMany: (resource, params) => {
    return AstraDataRESTProvider.getMany(resource, params);
  },

  getManyReference: (resource, params) => {
    return AstraDataRESTProvider.getManyReference(resource, params);
  },

  update: (resource, params) => {
    return AstraDataRESTProvider.update(resource, params);
  },

  updateMany: (resource, params) => {
    return AstraDataRESTProvider.updateMany(resource, params);
  },

  create: (resource, params) => {
    return AstraDataRESTProvider.create(resource, params);
  },

  delete: (resource, params) => {
    return AstraDataRESTProvider.delete(resource, params);
  },
  deleteMany: (resource, params) => {},
};

const AstraDataJSONProvider = {
  getOne: (resource, params) => {
    const url = API[resources[resource].API].getOne(resource, params.id);

    return httpClient(url, {
      ...apiOptions,
      method: "POST",
      body: JSON.stringify({
        params,
        resource: resources[resource],
        method: "findOne",
      }),
    }).then(({ json }) => ({
      data: {
        id: RecordId(resource, json),
        ...json,
      },
    }));
  },
};

const AstraDataRESTProvider = {
  getList: (resource, params) => {
    const { perPage } = params.pagination;

    /**
     * TO-DO: Handle filter, order and pagination
     */
    // const { page, perPage } = params.pagination;
    // const { field, order } = params.sort;

    const query = {
      "page-size": perPage,
    };

    if (params.meta && params.meta.fields) {
      query.fields = JSON.stringify(
        params.meta.fields.filter((f) => f !== "id")
      );
    }

    let url = API[resources[resource].API].getList(resource, query);
    if (params.filter && params.filter.id) {
      url = API[resources[resource].API].getManyByKey(
        resource,
        params.filter.id
      );
    }

    return httpClient(url, getApiOptions()).then(({ json }) => {
      return {
        data: tranformData(resource, json.data),
        total: json.count,
      };
    });
  },

  getOne: (resource, params) => {
    const url = API[resources[resource].API].getOne(resource, params.id);

    return httpClient(url, apiOptions).then(({ json }) => ({
      data: {
        id: RecordId(resource, json.data[0]),
        ...json.data[0],
      },
    }));
  },

  getMany: (resource, params) => {
    const url = API[resources[resource].API].getMany(
      resource,
      params.ids[0][0]
    );
    return httpClient(url, apiOptions).then(({ json }) => {
      return {
        data: tranformData(resource, json.data),
        total: json.count,
      };
    });
  },

  getManyReference: (resource, params) => {
    /**
     * TO-DO: Adjust for Astra
     */
    const url = API[resources[resource].API].getMany(resource, params.id);

    return httpClient(url, apiOptions).then(({ json }) => {
      return {
        data: tranformData(resource, json.data),
        total: json.count,
      };
    });
  },

  update: (resource, params) => {
    const url = API[resources[resource].API].getOne(resource, params.id);

    // Not allowed to send id and pk fields in body
    const body = params.data;
    resources[resource].key.concat("id").forEach((k) => delete body[k]);

    return httpClient(url, {
      ...apiOptions,
      method: "PUT",
      body: JSON.stringify(body),
    }).then(({ json }) => ({
      data: {
        id: RecordId(resource, json.data),
        ...json.data,
      },
    }));
  },

  updateMany: (resource, params) => {
    /**
     * TO-DO: Adjust for Astra
     */
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiRESTUrl}/${resource}?${stringify(query)}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  create: (resource, params) => {
    const url = API[resources[resource].API].getBase(resource);

    // Not allowed to send id field in body
    let body = params.data;
    ["id"].forEach((k) => delete body[k]);

    return httpClient(url, {
      ...apiOptions,
      method: "POST",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({
      data: { ...params.data, id: RecordId(resource, json) },
    }));
  },

  delete: (resource, params) => {
    const url = API[resources[resource].API].getOne(resource, params.id);
    return httpClient(url, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },

  deleteMany: (resource, params) => {
    /**
     * TO-DO: Adjust for Astra
     */

    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    return httpClient(`${apiRESTUrl}/${resource}?${stringify(query)}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },
};

export default AstraDataProvider;
