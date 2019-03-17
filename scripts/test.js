await async function(e, t) {
  const {
    componentsPath: n,
    lwcVersion: r,
    compilerOptions: c,
    diagnostics: l,
    componentsVersion: d,
    playgroundCacheAPI: m,
    useCompilerCache: g = !0
  } = t;
  f.version !== d && ((f.compilerCache = {}), (f.version = d));
  m && (0, u.setCacheAPI)(m);
  const y = await h(n + '/package.json');
  let v = !y.lwc || y.lwc.mapNamespaceFromPath,
    E = y.lwc ? y.lwc.modules : [];
  if (!v)
    throw new Error(
      `Unsupported lwc option from package.json: mapNamespaceFromPath = ${v}`
    );
  let A = {};
  for (let e = 0; e < E.length; e++) 'object' == typeof E[e] && (A = E[e]);
  function C(e, t, r, i) {
    if (A[i]) return n + '/' + A[i];
    const o = !i.startsWith('.');
    if (o) {
      const r = `${e}/${t.join('/')}`;
      return `${n}/src/${r}/`;
    }
  }
  return {
    resolveId(e) {
      const t = o.default.gte(r, '0.28.0');
      let [n, ...i] = t ? e.split('/') : e.split('-');
      if (
        (t && n.indexOf('-') >= 0 && ([n, ...i] = n.split('-')),
        !o.default.gte(d, '1.0.10-alpha'))
      )
        return (i = i.map(e => (0, s.paramCase)(e))), C(n, i, '-', e);
      {
        const t = C(n, i, '/', e);
        if (t) return t;
      }
    },
    load: async function(t) {
      if (t.endsWith('/')) {
        const n = await h(t),
          s = await Promise.all(n.map(e => p(e))),
          u = {};
        for (let e = 0; e < n.length; e++) u[n[e]] = s[e];
        const d = o.default.gte(r, '0.22.0'),
          m = t.split('/'),
          y = m[m.length - 2],
          v = m[m.length - 3],
          E = t;
        if (d) {
          if (g && f.compilerCache[t]) return f.compilerCache[t];
          const n = await e.compile(
            a({}, c, {
              input: t,
              outputConfig: a({}, c.outputConfig, { format: 'es' }),
              baseDir: E,
              name: y,
              namespace: v,
              files: u
            })
          );
          return (
            n.diagnostics && l.push(...n.diagnostics),
            n.success && (f.compilerCache[t] = n.result.code),
            n.result && n.result.code
          );
        }
        {
          const n = [t, `${y}.js`].join(i.SEPERATOR);
          return e.compile(n, {
            componentName: y,
            componentNameSpace: v,
            sources: u
          });
        }
      }
      {
        const e = await p(t);
        return e;
      }
    }
  };
};
