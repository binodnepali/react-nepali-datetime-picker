import { useState } from 'react';

import ExpandMoreIcon from '@assets/expand_more.svg';
import NextIcon from '@assets/chevron_right.svg';
import PrevIcon from '@assets/chevron_left.svg';

interface NepaliDatePickerProps {
  className?: string;
}

export const NepaliDatePicker: React.FC<NepaliDatePickerProps> = ({
  className,
}: NepaliDatePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);

  const [showYearSelector, setShowYearSelector] = useState(false);

  return (
    <div className={className}>
      <div className='flex flex-col space-y-2'>
        <input
          type='text'
          id='date-picker'
          className='border border-gray-300 rounded-md px-2 py-1'
          placeholder='Select Date'
          onClick={() => setShowPicker(true)}
        />
      </div>

      {showPicker && (
        <div className='bg-neutral-50 pt-4 px-4 pb-8'>
          <div className='flex flex-row justify-between'>
            <div className='flex flex-row gap-2 items-center'>
              <span>Aashadha</span>
              <span>2080</span>
              <ExpandMoreIcon
                onClick={() => setShowYearSelector((value) => !value)}
              />
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <PrevIcon />
              <NextIcon />
            </div>
          </div>

          {!showYearSelector && (
            <>
              <div className='grid grid-cols-7 gap-2 justify-items-center mt-4'>
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              <div className='grid grid-cols-7 gap-2 justify-items-center mt-4'>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>
                <span>11</span>
                <span>12</span>
                <span>13</span>
                <span>14</span>
                <span>15</span>
                <span>16</span>
                <span>17</span>
                <span>18</span>
                <span>19</span>
                <span>20</span>
                <span>21</span>
                <span>22</span>
                <span>23</span>
                <span>24</span>
                <span>25</span>
                <span>26</span>
                <span>27</span>
                <span>28</span>
                <span>29</span>
                <span>30</span>
                <span>31</span>
              </div>
            </>
          )}

          {showYearSelector && (
            <>
              <div className='grid grid-cols-4 gap-2 justify-items-center mt-4'>
                {[
                  2080, 2081, 2082, 2083, 2084, 2085, 2086, 2087, 2088, 2089,
                ].map((year) => (
                  <span key={year}>{year}</span>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
