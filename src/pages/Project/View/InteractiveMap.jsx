import React, { memo, useState } from 'react'
import cx from 'clsx'
import _map from 'lodash/map'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import countries from 'i18n-iso-countries'
import countriesEn from 'i18n-iso-countries/langs/en.json'
import countriesDe from 'i18n-iso-countries/langs/de.json'
import countriesEl from 'i18n-iso-countries/langs/el.json'
import countriesHi from 'i18n-iso-countries/langs/hi.json'
import countriesUk from 'i18n-iso-countries/langs/uk.json'
import countriesZh from 'i18n-iso-countries/langs/zh.json'
import countriesRu from 'i18n-iso-countries/langs/ru.json'
import countriesSv from 'i18n-iso-countries/langs/sv.json'

import countriesList from 'utils/countries'

countries.registerLocale(countriesEn)
countries.registerLocale(countriesDe)
countries.registerLocale(countriesEl)
countries.registerLocale(countriesRu)
countries.registerLocale(countriesHi)
countries.registerLocale(countriesUk)
countries.registerLocale(countriesZh)
countries.registerLocale(countriesSv)

const InteractiveMap = ({ data, onClickCountry, total }) => {
  const { t, i18n: { language } } = useTranslation('common')
  const [hoverShow, setHoverShow] = useState(false)
  const [dataHover, setDataHover] = useState(null)
  const [cursorPosition, setCursorPosition] = useState(null)

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const pageX = e.clientX - rect.left
    const pageY = e.clientY - rect.top
    setCursorPosition({ pageX, pageY })
  }

  return (
    <div className='relative'>
      <svg id='map' viewBox='0 0 1050 650' className='w-full h-full' onMouseMove={(e) => { onMouseMove(e) }}>
        <g>
          {_map(countriesList, (item, index) => {
            const perc = ((data[index] / total) * 100) || 0

            return (
              <path
                key={index}
                id={index}
                className={cx('cursor-pointer', {
                  'hover:opacity-90': perc > 0,
                  'fill-[#cfd1d4] dark:fill-[#374151]': perc === 0,
                  'fill-[#92b2e7] dark:fill-[#43448c]': perc > 0 && perc < 3,
                  'fill-[#6f9be3] dark:fill-[#4642bf]': perc >= 3 && perc < 10,
                  'fill-[#5689db] dark:fill-[#4a42db]': perc >= 10 && perc < 20,
                  'fill-[#3b82f6] dark:fill-[#4035dc]': perc >= 20,
                })}
                d={item.d}
                onClick={() => perc !== 0 && onClickCountry(index)}
                onMouseEnter={() => {
                  setHoverShow(true)
                  setDataHover({
                    countries: countries.getName(index, language),
                    data: data[index] || 0,
                  })
                }}
                onMouseLeave={() => {
                  setHoverShow(false)
                }}
              />
            )
          })}
        </g>
      </svg>
      <div>
        {hoverShow && (
          <div
            className='border-2 absolute z-30 text-xs dark:bg-gray-800 dark:shadow-gray-850 dark:border-gray-850 dark:text-gray-200 p-1 rounded-md'
            style={{
              top: cursorPosition.pageY + 20,
              left: cursorPosition.pageX - 20,
            }}
          >
            <strong>{dataHover.countries}</strong>
            <br />
            {t('project.unique')}
            :
            &nbsp;
            <strong className='dark:text-indigo-400'>
              {dataHover.data}
            </strong>
          </div>
        )}
      </div>
    </div>
  )
}

InteractiveMap.propTypes = {
  onClickCountry: PropTypes.func,
  data: PropTypes.objectOf(PropTypes.number),
  total: PropTypes.number,
}

InteractiveMap.defaultProps = {
  data: {},
  onClickCountry: () => { },
  total: 0,
}

export default memo(InteractiveMap)
